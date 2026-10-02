#!/usr/bin/env python3
"""Collect small public metadata candidates; never mutate reviewed catalog data."""
import argparse
import datetime
import hashlib
import ipaddress
import json
from pathlib import Path
import socket
import time
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler
from urllib.robotparser import RobotFileParser

ROOT = Path(__file__).resolve().parent.parent
HOSTS = {
    "github.com", "www.mesisemglobal.com", "www.nist.gov",
    "developers.google.com", "www.w3.org", "owasp.org",
    "developer.mozilla.org", "data.gov", "www.sba.gov",
    "creativecommons.org",
}
AGENT = "MesisemResourceCollector/1.0"
LIMIT = 512 * 1024


def safe_url(url):
    p = urlsplit(url)
    if p.scheme != "https" or p.hostname not in HOSTS or p.username or p.password or p.port not in (None, 443):
        raise ValueError("URL is not on the reviewed HTTPS source allowlist")
    for address in socket.getaddrinfo(p.hostname, 443, type=socket.SOCK_STREAM):
        if not ipaddress.ip_address(address[4][0]).is_global:
            raise ValueError("Source resolved to a non-public address")
    return p


class SafeRedirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        safe_url(newurl)
        # Redirects are not followed: their targets require a separate robots
        # review and catalog proposal, even if the host is allowlisted.
        raise ValueError("Redirect target requires separate review: " + newurl)


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = []
        self.description = ""

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True
        if tag == "meta":
            a = dict(attrs)
            if a.get("name", "").lower() == "description":
                self.description = a.get("content", "")[:500]

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)


def collect(selected):
    opener = build_opener(SafeRedirects())
    robots = {}
    last = {}
    candidates = []
    urls = dict.fromkeys(r["sourceUrl"] for r in selected)

    def get(url, delay):
        host = safe_url(url).hostname
        time.sleep(max(0, delay - (time.monotonic() - last.get(host, 0))))
        last[host] = time.monotonic()
        with opener.open(Request(url, headers={"User-Agent": AGENT, "Accept": "text/html,text/plain"}), timeout=20) as res:
            content = res.read(LIMIT + 1)
            if len(content) > LIMIT:
                raise ValueError("Response exceeded collection size cap")
            return res.status, res.headers.get_content_type(), content, res.headers.get_content_charset() or "utf-8"

    for url in urls:
        row = {"sourceUrl": url, "recordIds": [r["id"] for r in selected if r["sourceUrl"] == url],
               "checkedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
               "reviewStatus": "Pending review"}
        try:
            parsed = safe_url(url)
            host = parsed.hostname
            if host not in robots:
                robot_url = f"https://{host}/robots.txt"
                try:
                    _, _, body, charset = get(robot_url, 3)
                    robot = RobotFileParser()
                    robot.parse(body.decode(charset, errors="replace").splitlines())
                    robots[host] = robot
                except Exception:
                    robots[host] = None
            robot = robots[host]
            if robot is None:
                raise ValueError("Robots policy could not be established; collection skipped")
            if not robot.can_fetch(AGENT, url):
                raise ValueError("Robots policy disallows this source")
            delay = max(3, robot.crawl_delay(AGENT) or robot.crawl_delay("*") or 0)
            rate = robot.request_rate(AGENT) or robot.request_rate("*")
            if rate:
                delay = max(delay, rate.seconds / rate.requests)
            if delay > 60:
                raise ValueError("Crawl delay exceeds this collector's budget; collection skipped")
            status, kind, body, charset = get(url, delay)
            if kind not in ("text/html", "text/plain", "application/xhtml+xml"):
                raise ValueError("Not an allowed metadata content type")
            parser = Metadata()
            parser.feed(body.decode(charset, errors="replace"))
            row.update(httpStatus=status, title=" ".join(" ".join(parser.title).split())[:300],
                       description=parser.description, contentHash=hashlib.sha256(body).hexdigest())
            # Only metadata and hashes are saved; no full page snapshot.
        except HTTPError as err:
            row.update(httpStatus=err.code, error="HTTP failure; manual review required")
        except Exception as err:
            row["error"] = str(err)
        candidates.append(row)
    return candidates


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--id", action="append", help="Limit collection to a catalog ID (repeatable)")
    cli.add_argument("--acknowledge-terms", action="store_true",
                     help="Confirm you reviewed selected source terms and rights before collection")
    args = cli.parse_args()
    if not args.acknowledge_terms:
        cli.error("Review publisher terms and licensing, then pass --acknowledge-terms")
    catalog = json.loads((ROOT / "public/data/resources.json").read_text())
    rows = [r for r in catalog["resources"] if not args.id or r["id"] in args.id]
    if not rows or (args.id and set(args.id) - {r["id"] for r in rows}):
        cli.error("Unknown catalog ID")
    result = collect(rows)
    folder = ROOT / ".collection"
    folder.mkdir(exist_ok=True)
    filename = folder / ("candidates-" + datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ") + ".json")
    filename.write_text(json.dumps({"candidates": result}, indent=2) + "\n")
    print(f"{len(result)} candidates written to {filename.relative_to(ROOT)}; catalog unchanged")