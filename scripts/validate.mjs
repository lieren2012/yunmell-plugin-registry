import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => {
  const filePath = path.join(root, relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const registry = readJson('registry.json');
const errors = [];

if (registry.registryVersion !== 1) errors.push('registryVersion must be 1');
if (registry.registryId !== 'yunmell-plugin-registry') errors.push('registryId is invalid');
if (!Array.isArray(registry.plugins)) errors.push('registry.plugins must be an array');

const entries = [];
const pluginDir = path.join(root, 'plugins');
for (const fileName of fs.readdirSync(pluginDir).filter((name) => name.endsWith('.json'))) {
  const entry = readJson(path.join('plugins', fileName));
  entries.push({ fileName, entry });
  if (!entry.id || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(entry.id)) {
    errors.push(`${fileName}: invalid id`);
  }
  if (!entry.official?.packageName || !entry.official?.version || !entry.official?.source) {
    errors.push(`${fileName}: official packageName/version/source are required`);
  }
  if (!entry.yunmell?.adapterVersion || !['draft', 'testing', 'published', 'deprecated', 'blocked'].includes(entry.yunmell?.status)) {
    errors.push(`${fileName}: yunmell adapterVersion/status are invalid`);
  }
}

const ids = new Set();
for (const ref of registry.plugins) {
  if (ids.has(ref.id)) errors.push(`duplicate registry plugin id: ${ref.id}`);
  ids.add(ref.id);
  const match = entries.find(({ fileName }) => `plugins/${fileName}` === ref.entry);
  if (!match) {
    errors.push(`${ref.id}: registry entry does not point to a plugin file`);
  } else if (match.entry.id !== ref.id) {
    errors.push(`${ref.entry}: registry id does not match plugin id`);
  } else if (match.entry.yunmell.status !== ref.status) {
    errors.push(`${ref.id}: registry status does not match plugin status`);
  }
}

for (const { entry, fileName } of entries) {
  if (!ids.has(entry.id)) errors.push(`${fileName}: plugin file is not indexed in registry.json`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated registry with ${registry.plugins.length} indexed entries and ${entries.length} plugin files.`);
