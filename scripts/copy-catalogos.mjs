// Yurguen: antes de `vite build`, copia PDFs de ./catalogos → ./public/catalogos (Vite luego los lleva a dist).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'catalogos');
const destDir = path.join(root, 'public', 'catalogos');

if (!fs.existsSync(srcDir)) {
  console.log('[copy-catalogos] Yurguen: no existe catalogos/ en la raíz; seguimos sin copiar.');
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
let n = 0;
for (const name of fs.readdirSync(srcDir)) {
  if (!name.toLowerCase().endsWith('.pdf')) continue;
  const from = path.join(srcDir, name);
  const st = fs.statSync(from);
  if (!st.isFile()) continue;
  fs.copyFileSync(from, path.join(destDir, name));
  n += 1;
}
console.log(`[copy-catalogos] Yurguen: ${n} PDF(s) → public/catalogos/`);
