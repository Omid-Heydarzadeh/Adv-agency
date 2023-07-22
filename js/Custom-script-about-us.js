window.addEventListener(
  'load',
  () => {
    const storyImage = document.querySelectorAll('.story-image-container');
    const options = { root: null, threshold: 0.5 };
    const observer = new IntersectionObserver(handler, options);

    if (storyImage) storyImage.forEach((shape) => observer.observe(shape));

    function handler(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          entry.target.classList.toggle('animate', true);
      });
    }
  },
  { passive: true }
);
