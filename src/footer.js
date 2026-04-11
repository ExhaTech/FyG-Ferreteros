// Yurguen: pie con texto del cliente + crédito desarrollador (pie.* en site.json).
import { el } from './dom.js';

export function createFooter(site) {
  const pie = site.pie || {};
  const lines = [];

  if (pie.texto) {
    lines.push(el('p', { className: 'site-footer__line site-footer__cliente', text: pie.texto }));
  }

  const devUrl = pie.desarrolloUrl && String(pie.desarrolloUrl).trim();
  const devNombre = pie.desarrolloNombre && String(pie.desarrolloNombre).trim();
  if (devUrl || devNombre) {
    const previo = pie.desarrolloTexto || 'Desarrollado por';
    const nombre = devNombre || 'ExhaTech';
    const cta = pie.desarrolloCta || 'Encontranos';
    const host = devUrl ? devUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '') : '';

    const devChildren = [document.createTextNode(`${previo} `)];

    if (devUrl) {
      devChildren.push(
        el(
          'a',
          {
            className: 'site-footer__dev-link',
            href: devUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          [document.createTextNode(nombre)]
        )
      );
      if (host) {
        devChildren.push(
          document.createTextNode(` · ${cta}: `),
          el(
            'a',
            {
              className: 'site-footer__dev-link',
              href: devUrl,
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            [document.createTextNode(host)]
          )
        );
      }
    } else {
      devChildren.push(document.createTextNode(nombre));
    }

    lines.push(el('p', { className: 'site-footer__line site-footer__dev' }, devChildren));
  }

  return el('footer', { className: 'site-footer' }, lines);
}
