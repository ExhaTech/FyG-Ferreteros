// Yurguen: prefijo correcto para /catalogos/… y /vendedores/… cuando el sitio no está en la raíz del dominio (GitHub Pages, etc.).
export function publicUrl(path) {
  const base = import.meta.env.BASE_URL || '/';
  const rel = String(path || '').replace(/^\//, '');
  return base.endsWith('/') ? `${base}${rel}` : `${base}/${rel}`;
}

// Yurguen: agrega ?v= a una URL pública para invalidar cache del navegador/CDN (versión por PDF en build).
export function publicUrlWithVersion(path, version) {
  const url = publicUrl(path);
  const v = version != null && String(version).trim() !== '' ? String(version).trim() : '';
  if (!v) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${encodeURIComponent(v)}`;
}

// Yurguen: nombre de archivo para atributo download (mismo origen que el sitio; fuerza descarga en muchos navegadores).
export function fileNameFromPublicPath(path) {
  const clean = String(path || '')
    .replace(/^\//, '')
    .split(/[?#]/)[0];
  const parts = clean.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : 'catalogo.pdf';
}
