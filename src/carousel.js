// Yurguen: carrusel horizontal por scroll (flechas + snap); sin dependencias.
export function mountCarousels(root = document) {
  root.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const viewport = carousel.querySelector('.carousel__viewport');
    const track = carousel.querySelector('.carousel__track');
    const prev = carousel.querySelector('.carousel__prev');
    const next = carousel.querySelector('.carousel__next');
    if (!viewport || !track || !prev || !next) return;

    const step = () => {
      const slide = track.querySelector('.carousel__slide');
      if (!slide) return viewport.clientWidth * 0.85;
      const st = getComputedStyle(track);
      const gap = parseFloat(st.columnGap || st.gap) || 12;
      return slide.getBoundingClientRect().width + gap;
    };

    prev.addEventListener('click', () => {
      viewport.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      viewport.scrollBy({ left: step(), behavior: 'smooth' });
    });
  });
}
