// Yurguen: cabecera con marca + menú hamburguesa; textos desde site.json (ui.*).
import site from './data/site.json';
import { publicUrl } from './publicUrl.js';
import { el } from './dom.js';

const ui = site.ui || {};

function navItems() {
  return [
    { key: 'inicio', href: './index.html', label: ui.navInicio || 'Inicio' },
    { key: 'empresa', href: './empresa.html', label: ui.navEmpresa || 'Nuestra empresa' },
    { key: 'contacto', href: './contacto.html', label: ui.navContacto || 'Contacto' },
  ];
}

function buildBrand() {
  const logoSrc = site.cabecera?.logo && String(site.cabecera.logo).trim();
  const brandInner = [];
  if (logoSrc) {
    brandInner.push(
      el('img', {
        className: 'site-logo',
        src: publicUrl(logoSrc),
        alt: site.cabecera?.logoAlt || site.cabecera?.marca || 'Logo',
      })
    );
  }
  brandInner.push(
    el('div', { className: 'brand-text' }, [
      el('span', { className: 'marca', text: site.cabecera?.marca || '' }),
      site.cabecera?.eslogan && el('span', { className: 'eslogan', text: site.cabecera.eslogan }),
    ].filter(Boolean))
  );
  return el('a', { className: 'header-brand-link', href: './index.html' }, brandInner);
}

/**
 * @param {'inicio' | 'empresa' | 'contacto'} activeKey
 */
export function createHeader(activeKey) {
  const labelOpen = ui.menuAbrir || 'Abrir menú';
  const labelClose = ui.menuCerrar || 'Cerrar menú';

  const toggle = el(
    'button',
    {
      className: 'nav-toggle',
      type: 'button',
      'aria-label': labelOpen,
      'aria-expanded': 'false',
      'data-nav-toggle': '',
      'data-label-open': labelOpen,
      'data-label-close': labelClose,
    },
    [
      el('span', { className: 'burger-line' }),
      el('span', { className: 'burger-line' }),
      el('span', { className: 'burger-line' }),
    ]
  );

  const items = navItems().map((item) =>
    el('li', { className: 'nav-item' }, [
      el(
        'a',
        {
          href: item.href,
          className: item.key === activeKey ? 'nav-link nav-link--active' : 'nav-link',
        },
        [document.createTextNode(item.label)]
      ),
    ])
  );

  const drawer = el('nav', { className: 'nav-drawer', 'aria-label': ui.menuAriaPrincipal || 'Menú principal' }, [
    el('p', { className: 'nav-drawer-title', text: ui.menuTitulo || 'Menú' }),
    el('ul', { className: 'nav-list' }, items),
  ]);

  const backdrop = el('div', {
    className: 'nav-backdrop',
    'data-nav-close': '',
    'aria-hidden': 'true',
  });

  const inner = el('div', { className: 'header-inner' }, [buildBrand(), toggle]);

  const headerBar = el('header', { className: 'site-header' }, [inner]);
  return el('div', { className: 'site-header-group' }, [headerBar, backdrop, drawer]);
}
