// Yurguen: prefijo correcto para /catalogos/… y /vendedores/… cuando el sitio no está en la raíz del dominio (GitHub Pages, etc.).
export function publicUrl(path) {
  const base = import.meta.env.BASE_URL || '/';
  const rel = String(path || '').replace(/^\//, '');
  return base.endsWith('/') ? `${base}${rel}` : `${base}/${rel}`;
}

// Yurguen: nombre de archivo para atributo download (mismo origen que el sitio; fuerza descarga en muchos navegadores).
export function fileNameFromPublicPath(path) {
  const clean = String(path || '')
    .replace(/^\//, '')
    .split(/[?#]/)[0];
  const parts = clean.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : 'catalogo.pdf';
}
