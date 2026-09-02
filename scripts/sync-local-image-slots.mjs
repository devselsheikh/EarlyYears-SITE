import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const root = process.cwd();
const manifestPath = join(root, 'public', 'asset-manifest.json');
const imageRoot = join(root, 'public', 'images');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const report = [];

for (const [key, asset] of Object.entries(manifest.assets ?? {})) {
  const brand = key.startsWith('eduhub.') ? 'eduhub' : 'daycare';
  const outputRoot = join(imageRoot, brand);
  const isLamia = key === 'daycare.educator.lamia';
  const extension = isLamia ? 'png' : 'jpg';
  const outputPath = join(outputRoot, `${key}.${extension}`);
  const source = asset.fallback_url || asset.published_url;

  try {
    if (typeof source !== 'string' || source.length === 0) {
      throw new Error('No source URL');
    }

    if (source.startsWith('/')) {
      const localSource = join(root, 'public', source.replace(/^\/+/, ''));
      await mkdir(dirname(outputPath), { recursive: true });
      if (localSource !== outputPath) await copyFile(localSource, outputPath);
    } else {
      const response = await fetch(source, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
    }

    report.push({ key, path: `/images/${brand}/${key}.${extension}`, status: 'ready' });
    process.stdout.write(`ready  ${key}\n`);
  } catch (error) {
    report.push({ key, source, status: 'failed', error: String(error) });
    process.stderr.write(`failed ${key}: ${error}\n`);
  }
}

await writeFile(
  join(imageRoot, 'slot-report.json'),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), assets: report }, null, 2)}\n`,
);

if (report.some(item => item.status === 'failed')) process.exitCode = 1;
