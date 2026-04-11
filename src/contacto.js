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
  const wazeBlock =
    wazeUrl &&
    el('div', { className: 'contact-block contact-block--waze' }, [
      el('strong', { text: site.contacto.waze?.etiqueta || ui.wazeEtiquetaFallback || 'Waze' }),
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

  const correoVal = site.contacto?.correo && String(site.contacto.correo).trim();
  const correoBlock =
    correoVal &&
    el('div', { className: 'contact-block contact-block--correo' }, [
      el('strong', { text: site.contacto?.correoEtiqueta || ui.correoEtiquetaFallback || 'Correo' }),
      el('a', { href: `mailto:${correoVal}` }, [document.createTextNode(correoVal)]),
    ]);

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

  // Yurguen: fila horizontal (tel | correo | dirección | código actividad | Waze); mapa abajo si aplica.
  const contactRow = el(
    'div',
    { className: 'contact-row' },
    [
      el('div', { className: 'contact-block contact-block--tel' }, [
        el('strong', { text: site.contacto?.telefonoEtiqueta || ui.telefonoEtiquetaFallback || 'Teléfono' }),
        el('a', { href: `tel:${String(site.contacto?.telefono || '').replace(/\s/g, '')}` }, [
          document.createTextNode(site.contacto?.telefono || ''),
        ]),
      ]),
      correoBlock,
      el('div', { className: 'contact-block contact-block--dir' }, [
        el('strong', { text: ui.direccionEtiqueta || 'Dirección' }),
        el('p', { className: 'pre', text: site.contacto?.direccion || '' }),
      ]),
      codigoBlock,
      wazeBlock,
    ].filter(Boolean)
  );

  const cardInner = [contactRow];

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
