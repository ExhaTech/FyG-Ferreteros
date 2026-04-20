// Yurguen: genera public/…PNG del QR según contacto.qr.url en site.json (misma URL que escanea el usuario).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sitePath = path.join(root, 'src', 'data', 'site.json');
const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
const qr = site.contacto?.qr;
const url = qr?.url && String(qr.url).trim();

if (!url) {
  console.log('[generate-qr-sitio] Yurguen: sin contacto.qr.url; no genero imagen.');
  process.exit(0);
}

const rel = String(qr.imagen || '/qr-sitio-web.png').replace(/^\//, '');
const out = path.join(root, 'public', rel);
fs.mkdirSync(path.dirname(out), { recursive: true });

await QRCode.toFile(out, url, {
  width: 220,
  margin: 2,
  color: { dark: '#1a2744ff', light: '#ffffffff' },
});

console.log('[generate-qr-sitio] Yurguen:', rel, '←', url);
