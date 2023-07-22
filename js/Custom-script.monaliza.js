window.addEventListener(
  'load',
  (e) => {
    const pageHero = document.querySelector('#page-hero');
    const imageContainer = document.querySelector('.hero-images-container');

    if (imageContainer)
      imageContainer.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          pageHero.classList.add('alternate');
        },
        { once: true }
      );
  },
  { passive: true, once: true }
);
