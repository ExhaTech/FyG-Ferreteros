// Yurguen: página Nuestra empresa (historia / visión / misión) — HTML aparte para no cargar todo en inicio.
import site from './data/site.json';
import { applyLayoutFromSite } from './applyLayout.js';
import { el } from './dom.js';
import { createHeader } from './header.js';
import { createFooter } from './footer.js';
import { initNav } from './nav.js';

const app = document.getElementById('app');
const ui = site.ui || {};

const marca = site.cabecera?.marca || 'FYG PRO';
const navEmp = site.paginas?.empresaTituloNavegador || site.empresa?.tituloSeccion || ui.empresaTituloFallback || 'Nuestra empresa';
document.title = `${navEmp} — ${marca}`;

function render() {
  applyLayoutFromSite();

  const empresaCards = [
    el('div', { className: 'card' }, [
      el('h3', { text: site.empresa?.vision?.titulo || ui.visionTituloFallback || 'Visión' }),
      el('p', { className: 'pre', text: site.empresa?.vision?.texto || '' }),
    ]),
    el('div', { className: 'card' }, [
      el('h3', { text: site.empresa?.mision?.titulo || ui.misionTituloFallback || 'Misión' }),
      el('p', { className: 'pre', text: site.empresa?.mision?.texto || '' }),
    ]),
  ];

  // Yurguen: historia ancho completo arriba de visión/misión (texto largo).
  const hist = site.empresa?.historia;
  const historiaBlock =
    hist?.texto &&
    el('div', { className: 'empresa-historia-wrap' }, [
      el('div', { className: 'card' }, [
        el('h3', { text: hist.titulo || ui.historiaTituloFallback || 'Historia de la empresa' }),
        el('p', { className: 'pre', text: hist.texto }),
      ]),
    ]);

  const empresaSectionKids = [];
  if (historiaBlock) empresaSectionKids.push(historiaBlock);
  empresaSectionKids.push(el('div', { className: 'card-grid dos' }, empresaCards));

  const main = el('main', {}, [
    el('section', { className: 'page-hero' }, [
      el('h1', { className: 'page-hero__title', text: site.empresa?.tituloSeccion || ui.empresaTituloFallback || 'Nuestra empresa' }),
      el('p', { className: 'page-hero__lead', text: ui.empresaLeadPagina || 'Conocé nuestra historia, visión y misión.' }),
    ]),
    el('section', { id: 'empresa', className: 'section--secondary section-page-body' }, empresaSectionKids),
    createFooter(site),
  ]);

  app.replaceChildren(createHeader('empresa'), main);
  initNav(app);
}


render();
