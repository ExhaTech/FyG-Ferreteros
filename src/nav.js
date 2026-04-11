// Yurguen: abre/cierra el drawer del menú hamburguesa.
export function initNav(root = document) {
  const toggle = root.querySelector('[data-nav-toggle]');
  const drawer = root.querySelector('.nav-drawer');
  const backdrop = root.querySelector('[data-nav-close]');
  if (!toggle || !drawer) return;

  // Yurguen: etiquetas aria desde data-* (definidas en header.js con textos del JSON).
  const open = () => {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', toggle.getAttribute('data-label-close') || 'Cerrar menú');
    document.body.classList.add('nav-open');
    drawer.classList.add('nav-drawer--open');
    backdrop?.classList.add('nav-backdrop--visible');
  };

  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', toggle.getAttribute('data-label-open') || 'Abrir menú');
    document.body.classList.remove('nav-open');
    drawer.classList.remove('nav-drawer--open');
    backdrop?.classList.remove('nav-backdrop--visible');
  };

  toggle.addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) close();
    else open();
  });

  backdrop?.addEventListener('click', close);

  drawer.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', close);
  });

  // Yurguen: cerrar con Escape (accesibilidad).
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) close();
  });
}
