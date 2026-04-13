// Yurguen: página inicio — hero, catálogos, resumen contacto+dirección y pie; vendedores en vendedores.html.
import site from './data/site.json';
import { applyLayoutFromSite } from './applyLayout.js';
import { publicUrl, fileNameFromPublicPath } from './publicUrl.js';
import { el } from './dom.js';
import { createHeader } from './header.js';
import { createFooter } from './footer.js';
import { initNav } from './nav.js';
import { mountCarousels, buildCarouselElement } from './carousel.js';
import { buildContactoDireccionParts } from './contactoBloques.js';

const ui = site.ui || {};

const app = document.getElementById('app');

function setMetaDescription(text) {
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = el('meta', { name: 'description', content: text || '' });
    document.head.appendChild(metaDesc);
  } else if (text) metaDesc.setAttribute('content', text);
}

function catalogSlides() {
  const defTit = ui.catalogoTituloPorDefecto || 'Catálogo';
  const verTxt = ui.catalogoVerPdf || 'Ver en línea';
  const bajarTxt = ui.catalogoDescargarPdf || 'Descargar PDF';
  return (site.catalogos?.items || []).map((item) => {
    const href = publicUrl(item.archivo);
    const nombreArchivo = fileNameFromPublicPath(item.archivo);
    const acciones = el('div', { className: 'catalogo-item__acciones' }, [
      el(
        'a',
        {
          className: 'catalogo-item__link--ver',
          href,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        [document.createTextNode(verTxt)]
      ),
      el(
        'a',
        {
          className: 'catalogo-item__link--bajar',
          href,
          download: nombreArchivo,
        },
        [document.createTextNode(bajarTxt)]
      ),
    ]);
    return el('div', { className: 'carousel__slide carousel__slide--cat' }, [
      el('div', { className: 'card catalogo-item' }, [
        el('h3', { text: item.titulo || defTit }),
        item.descripcion && el('p', { className: 'desc', text: item.descripcion }),
        acciones,
      ]),
    ]);
  });
}

function render() {
  applyLayoutFromSite();
  document.title = site.meta?.tituloSitio || 'Ferretería';
  setMetaDescription(site.meta?.descripcion);

  const headerGroup = createHeader('inicio');

  const heroTitulo = site.hero?.titulo && String(site.hero.titulo).trim();
  const heroSub = site.hero?.subtitulo && String(site.hero.subtitulo).trim();
  let heroBlock = null;
  if (heroTitulo || heroSub) {
    const heroChildren = [];
    if (heroTitulo) heroChildren.push(el('h1', { text: heroTitulo }));
    if (heroSub) heroChildren.push(el('p', { text: heroSub }));
    heroBlock = el('div', { className: 'main-shell' }, [
      el('section', { className: 'hero hero--compact' }, heroChildren),
    ]);
  }

  const catalogosSection = el('section', { id: 'catalogos', className: 'section-inicio-panel' }, [
    el('div', { className: 'main-shell' }, [
      el('div', { className: 'section-head-strip' }, [
        el('div', { className: 'panel-section-head' }, [
          el('div', { className: 'panel-head' }, [
            el('h2', { text: site.catalogos?.tituloSeccion || ui.catalogosTituloFallback || 'Catálogos' }),
            (site.catalogos?.descripcion && String(site.catalogos.descripcion).trim()) &&
              el('p', { className: 'seccion-desc seccion-desc--panel', text: site.catalogos.descripcion.trim() }),
          ]),
        ]),
      ]),
      el('div', { className: 'carousel-strip' }, [buildCarouselElement(ui, catalogSlides())]),
    ]),
  ]);

  const { contactGrid } = buildContactoDireccionParts(site, { incluirFilaCodigo: false });
  const tituloContactoInicio =
    (site.inicio?.tituloContactoSeccion && String(site.inicio.tituloContactoSeccion).trim()) ||
    site.contacto?.tituloSeccion ||
    ui.contactoTituloFallback ||
    'Contacto';
  const descContactoInicio =
    site.inicio?.descripcionContacto && String(site.inicio.descripcionContacto).trim();

  const contactoResumenSection = el('section', { id: 'contacto-resumen', className: 'section-inicio-panel' }, [
    el('div', { className: 'main-shell' }, [
      el('div', { className: 'section-head-strip' }, [
        el('div', { className: 'panel-section-head' }, [
          el('div', { className: 'panel-head' }, [
            el('h2', { text: tituloContactoInicio }),
            descContactoInicio &&
              el('p', { className: 'seccion-desc seccion-desc--panel', text: descContactoInicio }),
          ]),
        ]),
      ]),
      el('div', { className: 'contacto-resumen-body' }, [
        el('div', { className: 'card card--contacto' }, [contactGrid]),
      ]),
    ]),
  ]);

  const main = el('main', { className: 'main main--inicio' }, [
    ...(heroBlock ? [heroBlock] : []),
    catalogosSection,
    contactoResumenSection,
    el('div', { className: 'main-shell' }, [createFooter(site)]),
  ]);

  app.replaceChildren(headerGroup, main);
  initNav(app);
  mountCarousels(app);
}

render();
