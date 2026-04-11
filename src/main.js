// Yurguen: página inicio — solo hero, carruseles (catálogos + vendedores) y pie; empresa/contacto en otras HTML.
import site from './data/site.json';
import { applyLayoutFromSite } from './applyLayout.js';
import { publicUrl, fileNameFromPublicPath } from './publicUrl.js';
import { el } from './dom.js';
import { createHeader } from './header.js';
import { createFooter } from './footer.js';
import { initNav } from './nav.js';
import { mountCarousels } from './carousel.js';

const ui = site.ui || {};

const app = document.getElementById('app');

function setMetaDescription(text) {
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = el('meta', { name: 'description', content: text || '' });
    document.head.appendChild(metaDesc);
  } else if (text) metaDesc.setAttribute('content', text);
}

function buildCarousel(slides) {
  return el('div', { className: 'carousel', 'data-carousel': '' }, [
    el(
      'button',
      {
        type: 'button',
        className: 'carousel__btn carousel__prev',
        'aria-label': ui.carouselAnterior || 'Anterior',
      },
      ['‹']
    ),
    el('div', { className: 'carousel__viewport' }, [
      el('div', { className: 'carousel__track' }, slides),
    ]),
    el(
      'button',
      {
        type: 'button',
        className: 'carousel__btn carousel__next',
        'aria-label': ui.carouselSiguiente || 'Siguiente',
      },
      ['›']
    ),
  ]);
}

function catalogSlides() {
  const defTit = ui.catalogoTituloPorDefecto || 'Catálogo';
  const verTxt = ui.catalogoVerPdf || 'Ver en línea';
  const bajarTxt = ui.catalogoDescargarPdf || 'Descargar PDF';
  return (site.catalogos?.items || []).map((item) => {
    const href = publicUrl(item.archivo);
    const nombreArchivo = fileNameFromPublicPath(item.archivo);
    // Yurguen: ver = nueva pestaña (visor PDF); descargar = atributo download (mismo origen).
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

// Yurguen: slides de una provincia (fotos con publicUrl para mismo BASE_URL que los PDF).
function vendedorSlidesForZona(zona) {
  const sinFoto = ui.vendedorSinFoto || 'Sin foto';
  return (zona.personas || []).map((p) => {
    const foto = p.foto;
    const imgBlock = foto
      ? el('img', { src: publicUrl(foto), alt: p.nombre || '' })
      : el('div', { className: 'sin-foto', text: sinFoto });
    return el('div', { className: 'carousel__slide carousel__slide--v' }, [
      el('div', { className: 'v-card v-card--carousel' }, [
        imgBlock,
        el('p', { className: 'nombre', text: p.nombre || '' }),
        el('p', { className: 'tel' }, [
          el('a', { href: `tel:${String(p.telefono || '').replace(/\s/g, '')}` }, [
            document.createTextNode(p.telefono || ''),
          ]),
        ]),
      ]),
    ]);
  });
}

function render() {
  applyLayoutFromSite();
  document.title = site.meta?.tituloSitio || 'Ferretería';
  setMetaDescription(site.meta?.descripcion);

  const headerGroup = createHeader('inicio');

  // Yurguen: hero solo si hay título o subtítulo en JSON (sin “Catálogos en PDF” u otro título vacío).
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

  // Yurguen: misma columna y márgenes que header / pie (.main-shell = layout.margenLateral + 920px).
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
      el('div', { className: 'carousel-strip' }, [buildCarousel(catalogSlides())]),
    ]),
  ]);

  const zonaVacía = ui.zonaSinVendedores || 'Sin vendedor asignado en esta provincia.';
  // Yurguen: acordeón por provincia (<details>) para expandir / contraer cada zona.
  const bloquesZonas = (site.vendedores?.zonas || []).map((zona, i) => {
    const slides = vendedorSlidesForZona(zona);
    const cuerpo =
      slides.length
        ? el('div', { className: 'carousel-strip carousel-strip--zona' }, [buildCarousel(slides)])
        : el('p', { className: 'zona-vendedores__empty', text: zona.mensajeVacio || zonaVacía });
    return el('details', { className: 'zona-vendedores zona-vendedores--accordion', open: i === 0 }, [
      el('summary', { className: 'zona-vendedores__summary' }, [
        el('span', { className: 'zona-vendedores__titulo', text: zona.nombre || 'Provincia' }),
      ]),
      el('div', { className: 'zona-vendedores__body' }, [cuerpo]),
    ]);
  });

  const vendedoresSection = el('section', { id: 'vendedores', className: 'section-inicio-panel' }, [
    el('div', { className: 'main-shell' }, [
      el('div', { className: 'section-head-strip' }, [
        el('div', { className: 'panel-section-head' }, [
          el('div', { className: 'panel-head' }, [
            el('h2', { text: site.vendedores?.tituloSeccion || ui.vendedoresTituloFallback || 'Vendedores' }),
            (site.vendedores?.descripcion && String(site.vendedores.descripcion).trim()) &&
              el('p', { className: 'seccion-desc seccion-desc--panel', text: site.vendedores.descripcion.trim() }),
          ]),
        ]),
      ]),
      el('div', { className: 'vendedores-zonas-wrap' }, bloquesZonas),
    ]),
  ]);

  const main = el('main', { className: 'main main--inicio' }, [
    ...(heroBlock ? [heroBlock] : []),
    catalogosSection,
    vendedoresSection,
    el('div', { className: 'main-shell' }, [createFooter(site)]),
  ]);

  app.replaceChildren(headerGroup, main);
  initNav(app);
  mountCarousels(app);
}

render();
