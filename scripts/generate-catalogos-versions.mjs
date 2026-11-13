// Yurguen: genera src/data/catalogos-versions.json con ?v=YYYYMMDDHHmmss por PDF
// (última fecha de commit del archivo en git; si no hay historial, mtime del archivo).
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pdfDir = path.join(root, 'public', 'catalogos');
const outFile = path.join(root, 'src', 'data', 'catalogos-versions.json');
const TZ = 'America/Costa_Rica';

function formatVersion(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? '00';
  return `${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}${get('second')}`;
}

function gitLastCommitDate(relPosixPath) {
  try {
    const unix = execSync(`git log -1 --format=%ct -- "${relPosixPath}"`, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!unix) return null;
    const ms = Number(unix) * 1000;
    if (!Number.isFinite(ms)) return null;
    return new Date(ms);
  } catch {
    return null;
  }
}

const versions = {};
if (fs.existsSync(pdfDir)) {
  for (const name of fs.readdirSync(pdfDir)) {
    if (!name.toLowerCase().endsWith('.pdf')) continue;
    const abs = path.join(pdfDir, name);
    const st = fs.statSync(abs);
    if (!st.isFile()) continue;
    const rel = `public/catalogos/${name}`;
    const fromGit = gitLastCommitDate(rel);
    const date = fromGit || st.mtime;
    versions[name] = formatVersion(date);
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(versions, null, 2)}\n`, 'utf8');
console.log(
  `[generate-catalogos-versions] Yurguen: ${Object.keys(versions).length} PDF(s) → src/data/catalogos-versions.json`
);
