// Yurguen: página Contacto — mapa opcional; grilla tel/correo/dir la arma contactoBloques.js; QR sitio desde site.json.
import site from './data/site.json';
import { applyLayoutFromSite } from './applyLayout.js';
import { publicUrl } from './publicUrl.js';
import { el } from './dom.js';
import { createHeader } from './header.js';
import { createFooter } from './footer.js';
import { initNav } from './nav.js';
import { buildContactoDireccionParts } from './contactoBloques.js';

const app = document.getElementById('app');
const ui = site.ui || {};

const marca = site.cabecera?.marca || 'FYG PRO';
const navCt =
  site.paginas?.contactoTituloNavegador || site.contacto?.tituloSeccion || ui.contactoTituloFallback || 'Contacto';
document.title = `${navCt} — ${marca}`;

function render() {
  applyLayoutFromSite();

  const mapaUrl = site.contacto?.mapa?.embedUrl && String(site.contacto.mapa.embedUrl).trim();
  const mapaBlock =
    mapaUrl &&
    el('div', { className: 'map-wrap' }, [
      el('iframe', {
        title: site.contacto.mapa?.titulo || ui.mapaTituloFallback || 'Mapa',
        src: mapaUrl,
        loading: 'lazy',
        referrerpolicy: 'no-referrer-when-downgrade',
      }),
    ]);

  const { contactGrid, codigoRow } = buildContactoDireccionParts(site, { incluirFilaCodigo: true });
  const cardInner = [contactGrid, codigoRow].filter(Boolean);

  // Yurguen: QR a la URL en contacto.qr.url; la imagen la genera scripts/generate-qr-sitio.mjs en dev/build.
  const qrCfg = site.contacto?.qr;
  const qrUrl = qrCfg?.url && String(qrCfg.url).trim();
  const qrImg = qrCfg?.imagen && String(qrCfg.imagen).trim();
  if (qrUrl && qrImg) {
    const pieQr = String(qrCfg.pie || ui.qrSitioPieFallback || '').trim();
    const qrKids = [
      el('h3', {
        className: 'contacto-qr__titulo',
        text: qrCfg.titulo || ui.qrSitioTituloFallback || 'Nuestra página web',
      }),
      el('img', {
        className: 'contacto-qr__img',
        src: publicUrl(qrImg),
        alt: qrUrl,
        width: 220,
        height: 220,
        decoding: 'async',
      }),
    ];
    // Yurguen: párrafo pie solo si hay texto (evita hueco vacío).
    if (pieQr) qrKids.push(el('p', { className: 'contacto-qr__pie', text: pieQr }));
    cardInner.push(el('div', { className: 'contacto-qr' }, qrKids));
  }

  if (mapaUrl) {
    cardInner.push(
      el('div', { className: 'contact-map-section' }, [
        el('h3', {
          className: 'mapa-subtitulo',
          text: site.contacto.mapa?.titulo || ui.mapaTituloFallback || 'Mapa',
        }),
        mapaBlock,
      ])
    );
  }

  const main = el('main', {}, [
    el('section', { className: 'page-hero' }, [
      el('h1', {
        className: 'page-hero__title',
        text: site.contacto?.tituloSeccion || ui.contactoTituloFallback || 'Contacto',
      }),
      el('p', { className: 'page-hero__lead', text: ui.contactoLeadPagina || 'Teléfono, ubicación y cómo llegar.' }),
    ]),
    el('section', { id: 'contacto', className: 'section--secondary section-page-body' }, [
      el('div', { className: 'card card--contacto' }, cardInner),
    ]),
    createFooter(site),
  ]);

  app.replaceChildren(createHeader('contacto'), main);
  initNav(app);
}

render();
