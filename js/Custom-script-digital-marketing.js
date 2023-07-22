window.addEventListener(
  'DOMContentLoaded',
  () => {
    const hero = document.querySelector('#page-hero');
    const hint = document.querySelector('#hero-hint');
    if (hint)
      hint.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          hero.classList.add('alternate');
        },
        { once: true }
      );
  },
  { passive: true }
);
