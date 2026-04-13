// Yurguen: página Vendedores por zona (antes en inicio); carruseles por provincia.
import site from './data/site.json';
import { applyLayoutFromSite } from './applyLayout.js';
import { publicUrl } from './publicUrl.js';
import { el } from './dom.js';
import { createHeader } from './header.js';
import { createFooter } from './footer.js';
import { initNav } from './nav.js';
import { mountCarousels, buildCarouselElement } from './carousel.js';

const ui = site.ui || {};
const app = document.getElementById('app');

const marca = site.cabecera?.marca || 'FYG PRO';
const navV =
  site.paginas?.vendedoresTituloNavegador ||
  site.vendedores?.tituloSeccion ||
  ui.vendedoresTituloFallback ||
  'Vendedores';
document.title = `${navV} — ${marca}`;

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

  const zonaVacía = ui.zonaSinVendedores || 'Sin vendedor asignado en esta provincia.';
  const bloquesZonas = (site.vendedores?.zonas || []).map((zona, i) => {
    const slides = vendedorSlidesForZona(zona);
    const cuerpo = slides.length
      ? el('div', { className: 'carousel-strip carousel-strip--zona' }, [buildCarouselElement(ui, slides)])
      : el('p', { className: 'zona-vendedores__empty', text: zona.mensajeVacio || zonaVacía });
    return el('details', { className: 'zona-vendedores zona-vendedores--accordion', open: i === 0 }, [
      el('summary', { className: 'zona-vendedores__summary' }, [
        el('span', { className: 'zona-vendedores__titulo', text: zona.nombre || 'Provincia' }),
      ]),
      el('div', { className: 'zona-vendedores__body' }, [cuerpo]),
    ]);
  });

  const leadRaw =
    (site.vendedores?.descripcionPagina && String(site.vendedores.descripcionPagina).trim()) ||
    (ui.vendedoresLeadPagina && String(ui.vendedoresLeadPagina).trim()) ||
    '';
  const heroKids = [
    el('h1', {
      className: 'page-hero__title',
      text: site.vendedores?.tituloSeccion || ui.vendedoresTituloFallback || 'Vendedores',
    }),
  ];
  if (leadRaw) heroKids.push(el('p', { className: 'page-hero__lead', text: leadRaw }));

  const main = el('main', {}, [
    el('section', { className: 'page-hero' }, heroKids),
    el('section', { id: 'vendedores', className: 'section--secondary section-page-body' }, [
      el('div', { className: 'vendedores-zonas-wrap vendedores-zonas-wrap--pagina' }, bloquesZonas),
    ]),
    createFooter(site),
  ]);

  app.replaceChildren(createHeader('vendedores'), main);
  initNav(app);
  mountCarousels(app);
}

render();
