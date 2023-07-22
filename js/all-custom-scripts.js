/**
 * Horizontal scroll function enables horizontal scrolling of the
 * pre-defined section (section#horizontal-scroll)
 */

(function horizontalScroll() {
  const scrollSection = document.querySelector('#horizontal-scroll');
  if (!scrollSection) return;
  const wrapper = scrollSection.querySelector('.h-scroll__wrapper');

  const observerOptions = { root: null, threshold: 0.3 };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observer.observe(scrollSection);

  let intersectionTime = 0;

  function observerCallback(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!hasInViewClass()) {
          toggleInViewClass(true);
          toggleOverflowClass(true);
          scrollSectionIntoView();
          setTimeout(() => {
            preventTouchEvents();
            if (isSectionOutOfView() && hasInViewClass())
              scrollSectionIntoView();
          }, 300);

          addWheelEventHandler();
          addPointerDownEventHandler();

          intersectionTime = performance.now();
        }
      } else {
        removeWheelEventHandler();
        removePointerDownEventHandler();
        removeTouchEventHandlers();
      }
    });
  }

  /*========== EVENT HANDLERS ============*/

  function pointerDownHandler(startEvent) {
    if (
      !scrollSection.contains(startEvent.target) ||
      startEvent.pointerType === 'mouse'
    )
      return;
    let lastEvent = startEvent;

    wrapper.setPointerCapture(startEvent.pointerId);
    window.addEventListener('pointermove', pointerMoveHandler);

    function pointerMoveHandler(e) {
      const deltaY = e.pageY - lastEvent.pageY;
      const deltaX = e.pageX - lastEvent.pageX;
      const maxMovement = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      lastEvent = e;
      const scale = 3;

      wheelHandler({
        deltaY: -maxMovement * scale,
      });
    }

    window.addEventListener(
      'pointerup',
      () => {
        wrapper.releasePointerCapture(startEvent.pointerId);
        window.removeEventListener('pointermove', pointerMoveHandler);
      },
      {
        once: true,
      }
    );
  }

  function wheelHandler(e) {
    const timeout = 300;

    if (performance.now() - intersectionTime < timeout || !hasInViewClass())
      return;

    if (isSectionOutOfView()) return scrollSectionIntoView();

    const distance = e.deltaY;

    if (
      (distance > 0 && !wrapperReachedEnd()) ||
      (distance < 0 && !wrapperReachedStart())
    ) {
      scroll(distance);
    } else if (distance !== 0) {
      finishScroll(timeout);
    }
  }

  /*================ UTILITY FUNCTIONS ==================*/
  const options = {
    passive: false,
    capture: true,
  };

  function removeTouchEventHandlers() {
    window.removeEventListener('touchstart', preventEvent, options);
    window.removeEventListener('touchmove', preventEvent, options);
  }

  function removePointerDownEventHandler() {
    window.removeEventListener('pointerdown', pointerDownHandler, options);
  }

  function removeWheelEventHandler() {
    window.removeEventListener('wheel', wheelHandler, options);
  }

  function addPointerDownEventHandler() {
    window.addEventListener('pointerdown', pointerDownHandler, options);
  }

  function addWheelEventHandler() {
    window.addEventListener('wheel', wheelHandler, options);
  }

  function preventTouchEvents() {
    window.addEventListener('touchstart', preventEvent, options);
    window.addEventListener('touchmove', preventEvent, options);
  }

  function hasInViewClass() {
    return scrollSection.classList.contains('in-view');
  }

  function toggleInViewClass(flag) {
    if (flag) scrollSection.classList.add('in-view');
    else scrollSection.classList.remove('in-view');
  }

  function toggleOverflowClass(flag) {
    if (flag) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
  }

  function isSectionOutOfView() {
    return Math.abs(sectionRect().top) > 1;
  }

  function scrollSectionIntoView() {
    window.scrollBy(0, sectionRect().top);
  }

  function sectionRect() {
    return scrollSection.getBoundingClientRect();
  }

  function preventEvent(e) {
    e.preventDefault();
  }

  function wrapperReachedStart() {
    return wrapper.scrollLeft === 0;
  }

  function wrapperReachedEnd() {
    return wrapper.scrollLeft + wrapper.clientWidth > wrapper.scrollWidth - 16;
  }

  function finishScroll(timeout) {
    toggleInViewClass(false);
    scrollSectionOutOfView(wrapperReachedStart() ? true : false);
    setTimeout(() => {
      toggleOverflowClass(false);
    }, timeout);
  }

  function scrollSectionOutOfView(toTop) {
    if (toTop) window.scrollBy(0, -sectionRect().height);
    else window.scrollBy(0, sectionRect().height);
  }

  const scroll = (() => {
    let totalAmount = 0;
    let totalTime = 0;
    let lastRun = 0;
    let request;

    return (amount, time = 100) => {
      totalAmount += amount;
      totalTime = Math.min(500, Math.max(16, totalTime + time));
      if (!request) request = requestAnimationFrame(progress);
    };

    function progress(timestamp) {
      if (!lastRun) {
        lastRun = timestamp;
        cancelAnimationFrame(request);
        request = requestAnimationFrame(progress);
        return;
      }
      if (
        totalTime > 0 &&
        ((totalAmount > 0 && !wrapperReachedEnd()) ||
          (totalAmount < 0 && !wrapperReachedStart()))
      ) {
        let passedTime = timestamp - lastRun;
        totalTime = Math.max(0, totalTime - passedTime);
        let curAmount = totalAmount / 10;

        if (Math.abs(curAmount) <= 0.5) curAmount = totalAmount / 2;
        else if (Math.abs(curAmount) <= 0.1) curAmount = totalAmount;

        totalAmount = totalAmount - curAmount;

        wrapper.scrollLeft += curAmount;

        lastRun = timestamp;
        request = requestAnimationFrame(progress);
      } else {
        totalAmount = 0;
        totalTime = 0;
        lastRun = 0;
        cancelAnimationFrame(request);
        request = 0;
      }
    }
  })();
})();


/**
 * Click handler for the hero section of the studio page
 */

window.addEventListener(
  'DOMContentLoaded',
  () => {
    const pageHero = document.querySelector('#studio-page-hero');
    const imageContainer = document.querySelector(
      '#studio-page-hero .hero-images-container'
    );

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

/**
 * Click handler for the hero section of the marketing page
 */

window.addEventListener(
  'DOMContentLoaded',
  () => {
    const hero = document.querySelector('#marketing-page-hero');
    const hint = document.querySelector('#marketing-page-hero-hint');

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

/**
 * Implement auto-animate mechanism using Intersection Observer
 * for the services section of the digital marketing page
 */

window.addEventListener(
  'DOMContentLoaded',
  () => {
    const shapes = document.querySelectorAll('.services-cell.shape');
    const options = { root: null, threshold: 1 };
    const observer = new IntersectionObserver(handler, options);
    if (shapes) shapes.forEach((shape) => observer.observe(shape));

    function handler(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('animate');
        else entry.target.classList.remove('animate');
      });
    }
  },
  { passive: true }
);

/**
 * Implement auto-animate mechanism using Intersection Observer
 * for the our story section of the about-us page
 */

window.addEventListener(
  'DOMContentLoaded',
  () => {
    const storyImage = document.querySelectorAll('.story-image-container');
    const options = { root: null, threshold: 0.5 };
    const observer = new IntersectionObserver(handler, options);
    if (storyImage) storyImage.forEach((shape) => observer.observe(shape));

    function handler(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('animate');
        else entry.target.classList.remove('animate');
      });
    }
  },
  { passive: true }
);
