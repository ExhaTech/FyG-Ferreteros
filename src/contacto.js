// Yurguen: página Contacto — teléfono, dirección, Waze y mapa opcional; HTML aparte.
import site from './data/site.json';
import { applyLayoutFromSite } from './applyLayout.js';
import { el } from './dom.js';
import { createHeader } from './header.js';
import { createFooter } from './footer.js';
import { initNav } from './nav.js';

const app = document.getElementById('app');
const ui = site.ui || {};

const marca = site.cabecera?.marca || 'FYG PRO';
const navCt = site.paginas?.contactoTituloNavegador || site.contacto?.tituloSeccion || ui.contactoTituloFallback || 'Contacto';
document.title = `${navCt} — ${marca}`;

// Yurguen: href tel: sin espacios (compat con marcación).
function hrefTelefono(numero) {
  return `tel:${String(numero || '').replace(/\s/g, '')}`;
}

// Yurguen: enlace wa.me solo con dígitos (código país + número, sin +).
function hrefWhatsApp(numero) {
  const d = String(numero || '').replace(/\D/g, '');
  return d ? `https://wa.me/${d}` : '';
}

// Yurguen: varios teléfonos desde contacto.telefonos[] o telefono + telefono2.
function listaTelefonos(c) {
  const arr = c?.telefonos;
  if (Array.isArray(arr) && arr.length) {
    return arr
      .map((x, i) => ({
        etiqueta:
          (x.etiqueta && String(x.etiqueta).trim()) ||
          (i === 0 ? c?.telefonoEtiqueta || ui.telefonoEtiquetaFallback || 'Teléfono' : ui.telefonoMovilEtiquetaFallback || 'Teléfono móvil'),
        numero: (x.numero && String(x.numero).trim()) || '',
      }))
      .filter((x) => x.numero);
  }
  const out = [];
  const t1 = c?.telefono && String(c.telefono).trim();
  if (t1) {
    out.push({
      etiqueta: c?.telefonoEtiqueta || ui.telefonoEtiquetaFallback || 'Teléfono',
      numero: t1,
    });
  }
  const t2 = c?.telefono2 && String(c.telefono2).trim();
  if (t2) {
    out.push({
      etiqueta: c?.telefono2Etiqueta || ui.telefonoMovilEtiquetaFallback || 'Teléfono móvil',
      numero: t2,
    });
  }
  return out;
}

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

  const wazeUrl = site.contacto?.waze?.url && String(site.contacto.waze.url).trim();
  const wazeEtiqueta = site.contacto?.waze?.etiqueta && String(site.contacto.waze.etiqueta).trim();
  const wazeBlock =
    wazeUrl &&
    el('div', { className: 'contact-block contact-block--waze contact-block--waze-inline' }, [
      wazeEtiqueta && el('strong', { text: wazeEtiqueta }),
      el(
        'a',
        {
          className: 'link-waze',
          href: wazeUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        [
          document.createTextNode(
            site.contacto?.waze?.textoBoton || ui.wazeTextoBotonFallback || 'Abrir ubicación en Waze'
          ),
        ]
      ),
    ]);

  // Yurguen: botón estilo Waze → abre chat en WhatsApp (wa.me).
  const wa = site.contacto?.whatsapp;
  const waNum = wa?.numero && String(wa.numero).trim();
  const waHref = waNum ? hrefWhatsApp(waNum) : '';
  const waMostrar = (wa?.mostrar && String(wa.mostrar).trim()) || waNum;
  const etiquetaMovil =
    (wa?.telefonoMovilEtiqueta && String(wa.telefonoMovilEtiqueta).trim()) ||
    ui.telefonoMovilEtiquetaFallback ||
    'Teléfono móvil';
  // Yurguen: sin título “WhatsApp” ni línea extra; solo “Teléfono móvil” + número (tel:) + botón wa.me.
  const whatsappBlock =
    waHref &&
    el('div', { className: 'contact-block contact-block--whatsapp contact-block--whatsapp-tel-btn' }, [
      el('div', { className: 'contact-tel-line' }, [
        el('strong', { text: etiquetaMovil }),
        el('a', { href: hrefTelefono(wa.mostrar || waNum) }, [document.createTextNode(waMostrar)]),
      ]),
      el(
        'a',
        {
          className: 'link-whatsapp',
          href: waHref,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        [
          document.createTextNode(
            wa?.textoBoton || ui.whatsappTextoBotonFallback || 'Abrir WhatsApp'
          ),
        ]
      ),
    ]);

  const correoVal = site.contacto?.correo && String(site.contacto.correo).trim();
  const correoBlock =
    correoVal &&
    el('div', { className: 'contact-block contact-block--correo' }, [
      el('strong', { text: site.contacto?.correoEtiqueta || ui.correoEtiquetaFallback || 'Correo' }),
      el('a', { href: `mailto:${correoVal}` }, [document.createTextNode(correoVal)]),
    ]);

  // Yurguen: datos siguen en site.json; no se pinta salvo mostrarCodigoActividad === true.
  const codigoVal = site.contacto?.codigoActividad && String(site.contacto.codigoActividad).trim();
  const codigoBlock =
    codigoVal &&
    el('div', { className: 'contact-block contact-block--actividad' }, [
      el('strong', {
        text:
          site.contacto?.codigoActividadEtiqueta ||
          ui.codigoActividadEtiquetaFallback ||
          'Código de actividad',
      }),
      el('p', { className: 'pre', text: codigoVal }),
    ]);

  // Yurguen: si hay WhatsApp, el móvil va en ese bloque (evita duplicar la misma línea).
  const telefonos = listaTelefonos(site.contacto).filter((p) => {
    if (!waHref) return true;
    const dTel = String(p.numero || '').replace(/\D/g, '');
    const dWa = String(waNum || '').replace(/\D/g, '');
    if (!dWa || !dTel) return true;
    return dTel !== dWa;
  });
  const telefonosBlock =
    telefonos.length &&
    el(
      'div',
      { className: `contact-block ${telefonos.length > 1 ? 'contact-block--telefonos' : 'contact-block--tel'}` },
      telefonos.map((p) =>
        el('div', { className: 'contact-tel-line' }, [
          el('strong', { text: p.etiqueta }),
          el('a', { href: hrefTelefono(p.numero) }, [document.createTextNode(p.numero)]),
        ])
      )
    );

  // Yurguen: 3 columnas — (1) tel fijo + móvil + WhatsApp, (2) correo, (3) dirección + Waze debajo; código actividad aparte.
  const colTelWaKids = [telefonosBlock, whatsappBlock].filter(Boolean);
  const colTelWa =
    colTelWaKids.length &&
    el('div', { className: 'contact-grid__col contact-grid__col--tel-wa' }, colTelWaKids);

  const colCorreo =
    correoBlock &&
    el('div', { className: 'contact-grid__col contact-grid__col--correo' }, [correoBlock]);

  const dirBlock = el('div', { className: 'contact-block contact-block--dir' }, [
    el('strong', { text: ui.direccionEtiqueta || 'Dirección' }),
    el('p', { className: 'pre', text: site.contacto?.direccion || '' }),
  ]);

  const colDirWazeKids = [dirBlock, wazeBlock].filter(Boolean);
  const colDirWaze = el('div', { className: 'contact-grid__col contact-grid__col--dir-waze' }, colDirWazeKids);

  const contactGrid = el(
    'div',
    { className: 'contact-grid' },
    [colTelWa, colCorreo, colDirWaze].filter(Boolean)
  );

  const codigoRow =
    site.contacto?.mostrarCodigoActividad === true &&
    codigoBlock &&
    el('div', { className: 'contact-row contact-row--solo-codigo' }, [codigoBlock]);

  const cardInner = [contactGrid, codigoRow].filter(Boolean);

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
      el('h1', { className: 'page-hero__title', text: site.contacto?.tituloSeccion || ui.contactoTituloFallback || 'Contacto' }),
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
