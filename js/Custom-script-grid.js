window.addEventListener(
  'load',
  () => {
    const shapes = document.querySelectorAll('.shape');
    const options = { root: null, threshold: 1 };
    const observer = new IntersectionObserver(handler, options);
    if (shapes) shapes.forEach((shape) => observer.observe(shape));

    function handler(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          entry.target.classList.toggle('animate', true);
      });
    }
  },
  { passive: true }
);
