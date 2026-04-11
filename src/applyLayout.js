// Yurguen: aplica layout.margenLateral y layout.anchoMaximoContenido como variables CSS.
import site from './data/site.json';

export function applyLayoutFromSite() {
  const raw = site.layout?.margenLateral;
  const gutter = raw != null && String(raw).trim() !== '' ? String(raw).trim() : '0.75rem';
  document.documentElement.style.setProperty('--page-gutter', gutter);

  // Yurguen: ancho de columna (header, main, inicio); si no va en JSON usa el default del :root en style.css.
  const maxW = site.layout?.anchoMaximoContenido;
  if (maxW != null && String(maxW).trim() !== '') {
    document.documentElement.style.setProperty('--page-max-width', String(maxW).trim());
  }
}
