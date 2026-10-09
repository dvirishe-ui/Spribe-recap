// Builds the operator pilot into ONE self-contained HTML file
// (dist-pilot/northstar-pilot.html) with the CSS and JS inlined, so it can be
// shared as a single page.
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outDir = join(root, 'dist-pilot');

await build({
  root,
  configFile: false,
  logLevel: 'warn',
  plugins: [react()],
  build: {
    outDir,
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: { input: join(root, 'pilot.html') },
  },
});

const assets = join(outDir, 'assets');
const files = readdirSync(assets);
const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(assets, f), 'utf8')).join('\n');
const js = files.filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(assets, f), 'utf8')).join('\n');

const html = `<title>Northstar Replay Pilot</title>
<meta name="description" content="Operator pilot of SPRIBE Replay 2026 inside the fictional Northstar Casino. All data is invented.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter+Tight:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap">
<style>${css}</style>
<div id="pilot-root"></div>
<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>
`;
const out = join(outDir, 'northstar-pilot.html');
writeFileSync(out, html);
console.log(`wrote ${out} (${(html.length / 1024).toFixed(0)} KB)`);
