// Yurguen: grilla tel / correo / dir+Waze compartida entre inicio y página contacto.
import { el } from './dom.js';

function hrefTelefono(numero) {
  return `tel:${String(numero || '').replace(/\s/g, '')}`;
}

function hrefWhatsApp(numero) {
  const d = String(numero || '').replace(/\D/g, '');
  return d ? `https://wa.me/${d}` : '';
}

function listaTelefonos(c, ui) {
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

/**
 * Yurguen: contactGrid + opcional fila código (solo página contacto si mostrarCodigoActividad).
 * @param {{ incluirFilaCodigo?: boolean }} opts
 */
export function buildContactoDireccionParts(site, opts = {}) {
  const ui = site.ui || {};
  const c = site.contacto || {};
  const incluirFilaCodigo = opts.incluirFilaCodigo === true;

  const wa = c.whatsapp;
  const waNum = wa?.numero && String(wa.numero).trim();
  const waHref = waNum ? hrefWhatsApp(waNum) : '';
  const waMostrar = (wa?.mostrar && String(wa.mostrar).trim()) || waNum;
  const etiquetaMovil =
    (wa?.telefonoMovilEtiqueta && String(wa.telefonoMovilEtiqueta).trim()) ||
    ui.telefonoMovilEtiquetaFallback ||
    'Teléfono móvil';

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
        [document.createTextNode(wa?.textoBoton || ui.whatsappTextoBotonFallback || 'Abrir WhatsApp')]
      ),
    ]);

  const wazeUrl = c.waze?.url && String(c.waze.url).trim();
  const wazeEtiqueta = c.waze?.etiqueta && String(c.waze.etiqueta).trim();
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
        [document.createTextNode(c.waze?.textoBoton || ui.wazeTextoBotonFallback || 'Abrir ubicación en Waze')]
      ),
    ]);

  const correoVal = c.correo && String(c.correo).trim();
  const correoBlock =
    correoVal &&
    el('div', { className: 'contact-block contact-block--correo' }, [
      el('strong', { text: c.correoEtiqueta || ui.correoEtiquetaFallback || 'Correo' }),
      el('a', { href: `mailto:${correoVal}` }, [document.createTextNode(correoVal)]),
    ]);

  const codigoVal = c.codigoActividad && String(c.codigoActividad).trim();
  const codigoBlock =
    codigoVal &&
    el('div', { className: 'contact-block contact-block--actividad' }, [
      el('strong', {
        text: c.codigoActividadEtiqueta || ui.codigoActividadEtiquetaFallback || 'Código de actividad',
      }),
      el('p', { className: 'pre', text: codigoVal }),
    ]);

  const telefonos = listaTelefonos(c, ui).filter((p) => {
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

  const colTelWaKids = [telefonosBlock, whatsappBlock].filter(Boolean);
  const colTelWa =
    colTelWaKids.length &&
    el('div', { className: 'contact-grid__col contact-grid__col--tel-wa' }, colTelWaKids);

  const colCorreo =
    correoBlock && el('div', { className: 'contact-grid__col contact-grid__col--correo' }, [correoBlock]);

  const dirBlock = el('div', { className: 'contact-block contact-block--dir' }, [
    el('strong', { text: ui.direccionEtiqueta || 'Dirección' }),
    el('p', { className: 'pre', text: c.direccion || '' }),
  ]);

  const colDirWaze = el('div', { className: 'contact-grid__col contact-grid__col--dir-waze' }, [
    dirBlock,
    wazeBlock,
  ].filter(Boolean));

  const contactGrid = el('div', { className: 'contact-grid' }, [colTelWa, colCorreo, colDirWaze].filter(Boolean));

  let codigoRow = null;
  if (incluirFilaCodigo && c.mostrarCodigoActividad === true && codigoBlock) {
    codigoRow = el('div', { className: 'contact-row contact-row--solo-codigo' }, [codigoBlock]);
  }

  return { contactGrid, codigoRow };
}
