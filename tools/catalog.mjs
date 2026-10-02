import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const catalog = JSON.parse(await readFile(path.join(root, 'public/data/resources.json'), 'utf8'));
export const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const fields = ['id', 'title', 'summary', 'category', 'tags', 'publisher', 'sourceUrl', 'type', 'status', 'collectedAt', 'reviewedAt', 'reuse', 'notes', 'featured'];

export function validateCatalog() {
  if (catalog.version !== 1 || !Array.isArray(catalog.resources) || !catalog.resources.length) throw new Error('Invalid catalog envelope');
  const ids = new Set();
  const today = new Date().toISOString().slice(0, 10);
  const dateValid = date => /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(date).toISOString().slice(0, 10) === date && date <= today;
  if (!dateValid(catalog.updatedAt)) throw new Error('Invalid catalog update date');
  for (const r of catalog.resources) {
    for (const field of fields) if (r[field] === undefined) throw new Error(`Missing ${field} in ${r.id}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.id) || ids.has(r.id)) throw new Error(`Invalid or duplicate ID: ${r.id}`);
    ids.add(r.id);
    for (const field of fields.filter(f => !['tags', 'featured'].includes(f))) if (typeof r[field] !== 'string' || !r[field].trim()) throw new Error(`Invalid ${field}: ${r.id}`);
    if (!Array.isArray(r.tags) || r.tags.some(t => typeof t !== 'string' || !t.trim()) || typeof r.featured !== 'boolean') throw new Error(`Invalid tags/featured: ${r.id}`);
    if (!['Guide', 'Standard', 'Dataset', 'Repository'].includes(r.type)) throw new Error(`Invalid type: ${r.id}`);
    if (!['Source reviewed', 'Company-provided', 'Unavailable'].includes(r.status)) throw new Error(`Invalid status: ${r.id}`);
    if (!['Company', 'Consulting', 'Technology', 'Cybersecurity', 'Analytics', 'Marketing', 'Media', 'Ventures'].includes(r.category)) throw new Error(`Invalid category: ${r.id}`);
    const url = new URL(r.sourceUrl);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`Invalid source URL: ${r.id}`);
    if (!dateValid(r.collectedAt) || !dateValid(r.reviewedAt) || r.reviewedAt < r.collectedAt || r.reviewedAt > catalog.updatedAt) throw new Error(`Invalid chronology: ${r.id}`);
  }
  return ids.size;
}

export async function exportCsv(destination = path.join(root, 'public/data/resources.csv')) {
  const cell = value => `"${String(Array.isArray(value) ? value.join('; ') : value).replace(/^([=+\-@\t\r])/, "'$1").replace(/"/g, '""')}"`;
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, [fields.map(cell).join(','), ...catalog.resources.map(r => fields.map(f => cell(r[f])).join(','))].join('\r\n') + '\r\n');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Catalog validated: ${validateCatalog()} sourced records`);
  await exportCsv();
}