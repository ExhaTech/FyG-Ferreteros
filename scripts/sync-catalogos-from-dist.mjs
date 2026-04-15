// Yurguen: copia dist/catalogos → public/catalogos para que lo “bueno” del build quede en el repo (fuente que Vite vuelve a empaquetar).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'dist', 'catalogos');
const destDir = path.join(root, 'public', 'catalogos');

if (!fs.existsSync(srcDir)) {
  console.error('[sync-catalogos-from-dist] Yurguen: no existe dist/catalogos. Corré antes npm run build.');
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });
let n = 0;
for (const name of fs.readdirSync(srcDir)) {
  const from = path.join(srcDir, name);
  if (!fs.statSync(from).isFile()) continue;
  fs.copyFileSync(from, path.join(destDir, name));
  n += 1;
}
console.log(`[sync-catalogos-from-dist] Yurguen: ${n} archivo(s) dist/catalogos → public/catalogos/`);
