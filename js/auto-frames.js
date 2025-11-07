

(() => {
  const deck = document.querySelector('#bonmestre-deck');
  if (!deck) return;

  const frames = [...deck.querySelectorAll('.frame')];
  if (!frames.length) return;

  // Duración por pantalla (default 8s)
  const getDuration = (el, def = 8000) => {
    const v = (el.dataset.duration || '').trim();
    if (!v) return def;
    if (v.endsWith('ms')) return parseInt(v);
    if (v.endsWith('s')) return Math.round(parseFloat(v) * 1000);
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : def;
  };

  let i = Math.max(0, frames.findIndex(f => f.classList.contains('is-active')));
  if (i === -1) { i = 0; frames[0].classList.add('is-active'); }

  // Función que cambia de pantalla
  const showNext = () => {
    frames[i].classList.remove('is-active');
    frames[i].setAttribute('aria-hidden', 'true');
    i = (i + 1) % frames.length;
    frames[i].classList.add('is-active');
    frames[i].setAttribute('aria-hidden', 'false');
    schedule(); // programa siguiente
  };

  let timer = null;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(showNext, getDuration(frames[i], 8000));
  };

  // Inicializa
  frames.forEach(f => f.setAttribute('aria-hidden', f.classList.contains('is-active') ? 'false' : 'true'));
  schedule();
})();
