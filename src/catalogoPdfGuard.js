// Yurguen: antes de abrir/descargar un PDF de catálogo, comprobamos que exista; si no, modal sobrio (evita pestaña 404 del navegador).
import { el } from './dom.js';

let escapeHandler = null;

function closeCatalogoPdfMsg() {
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }
  document.getElementById('catalogo-pdf-msg')?.remove();
}

async function pdfDisponible(url) {
  try {
    let res = await fetch(url, { method: 'HEAD', cache: 'no-store', redirect: 'follow' });
    if (res.ok) return true;
    if (res.status === 405) {
      res = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
        cache: 'no-store',
        redirect: 'follow',
      });
      return res.ok;
    }
    return false;
  } catch {
    return false;
  }
}

function openCatalogoPdfMsg(ui, nombreCatalogo) {
  closeCatalogoPdfMsg();
  const titulo = ui.catalogoNoDisponibleTitulo || 'Documento no disponible';
  const texto = ui.catalogoNoDisponibleTexto || 'Por ahora no podemos mostrar este archivo. Podés intentar más tarde o contactarnos.';
  const cerrar = ui.catalogoNoDisponibleCerrar || 'Entendido';

  const cierre = () => closeCatalogoPdfMsg();

  escapeHandler = (ev) => {
    if (ev.key === 'Escape') cierre();
  };
  document.addEventListener('keydown', escapeHandler);

  const panelKids = [
    el('h2', { id: 'catalogo-pdf-msg-title', className: 'catalogo-pdf-msg__title', text: titulo }),
    el('p', { className: 'catalogo-pdf-msg__body', text: texto }),
  ];
  if (nombreCatalogo) {
    panelKids.push(el('p', { className: 'catalogo-pdf-msg__nombre', text: nombreCatalogo }));
  }
  panelKids.push(
    el(
      'button',
      {
        type: 'button',
        className: 'catalogo-pdf-msg__btn',
        onclick: cierre,
      },
      [document.createTextNode(cerrar)]
    )
  );

  const wrap = el(
    'div',
    {
      id: 'catalogo-pdf-msg',
      className: 'catalogo-pdf-msg',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'catalogo-pdf-msg-title',
    },
    [
      el('div', { className: 'catalogo-pdf-msg__backdrop', onclick: cierre, 'aria-hidden': 'true' }),
      el('div', { className: 'catalogo-pdf-msg__panel' }, panelKids),
    ]
  );
  document.body.appendChild(wrap);
  wrap.querySelector('.catalogo-pdf-msg__btn')?.focus();
}

/**
 * Yurguen: enlaces con data-catalogo-pdf — click interceptado en #catalogos.
 * @param {HTMLElement} root — típicamente #app
 * @param {Record<string, string>} ui — site.ui
 */
export function mountCatalogoPdfGuard(root, ui) {
  root.addEventListener('click', async (e) => {
    const link = e.target.closest('a[data-catalogo-pdf]');
    if (!link) return;
    const pdfUrl = link.getAttribute('href');
    if (!pdfUrl) return;
    e.preventDefault();

    const nombreCard = link.closest('.catalogo-item')?.querySelector('h3')?.textContent?.trim() || '';
    const esVer = link.hasAttribute('data-catalogo-ver');

    const ok = await pdfDisponible(pdfUrl);
    if (!ok) {
      openCatalogoPdfMsg(ui, nombreCard);
      return;
    }

    if (esVer) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const nombreArchivo = link.getAttribute('download') || '';
    const tmp = document.createElement('a');
    tmp.href = pdfUrl;
    tmp.download = nombreArchivo;
    tmp.rel = 'noopener';
    document.body.appendChild(tmp);
    tmp.click();
    tmp.remove();
  });
}
