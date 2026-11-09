/* One initialization; resize without losing the reader's page. */
(() => {
  const element = document.getElementById('flipbook');
  if (!element || !window.jQuery || !jQuery.fn.turn) return;
  const book = jQuery(element);
  const controls = document.createElement('nav');
  controls.className = 'book-controls';
  controls.setAttribute('aria-label', 'Book pages');
  controls.innerHTML = '<button type="button">← Previous</button><span aria-live="polite"></span><button type="button">Next →</button>';
  element.after(controls);
  const [previous, next] = controls.querySelectorAll('button');
  const status = controls.querySelector('span');
  function update() {
    const page = book.turn('page');
    const pages = book.turn('pages');
    status.textContent = `Page ${page} of ${pages}`;
    previous.disabled = page <= 1;
    next.disabled = page >= pages;
  }
  let ready = false;
  let lastWidth = 0;
  let lastHeight = 0;
  function resize() {
    const available = element.parentElement.clientWidth;
    if (!available) return;
    const single = window.innerWidth < 768;
    const ratio = single ? .75 : 1.5;
    const width = Math.floor(Math.min(available, 1200, Math.max(240, window.innerHeight - 160) * ratio));
    const height = Math.round(width / ratio);
    if (ready && width === lastWidth && height === lastHeight) return;
    lastWidth = width; lastHeight = height;
    if (!ready) {
      book.turn({ width, height, display: single ? 'single' : 'double', autoCenter: false, acceleration: true, when: { turned: update } });
      ready = true;
      element.classList.add('book-ready');
    } else {
      book.turn('stop');
      book.turn('display', single ? 'single' : 'double');
      book.turn('size', width, height);
    }
    update();
  }
  previous.addEventListener('click', () => book.turn('previous'));
  next.addEventListener('click', () => book.turn('next'));
  controls.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); book.turn(event.key === 'ArrowRight' ? 'next' : 'previous');
    }
  });
  new ResizeObserver(resize).observe(element.parentElement);
  window.addEventListener('resize', resize);
  resize();
})();
