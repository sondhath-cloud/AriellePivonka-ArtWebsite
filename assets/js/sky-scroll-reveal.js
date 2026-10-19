/**
 * Sky page: crossfade wordmark → subheader + CTA on scroll.
 * Adapted from climate-house lander-scroll-reveal.js.
 */
(function () {
  'use strict';

  if (!document.body.classList.contains('page--sky')) {
    return;
  }

  var copy = document.getElementById('sky-hero-copy');
  var reveal = copy && copy.querySelector('.sky-reveal');
  if (!copy || !reveal) {
    return;
  }

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  var swapStart = 0.5;
  var swapEnd = 0.68;
  var ticking = false;

  function scrollTop() {
    return (
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  function maxScroll() {
    var scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    return Math.max(0, scrollHeight - window.innerHeight);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function update() {
    ticking = false;
    var end = maxScroll();

    if (prefersReducedMotion || end === 0) {
      copy.classList.add('is-subheader');
      reveal.setAttribute('aria-hidden', 'false');
      reveal.classList.add('is-interactive');
      copy.style.setProperty('--hero-fade', '0');
      copy.style.setProperty('--sub-fade', '1');
      return;
    }

    var progress = scrollTop() / end;
    var swapT = clamp((progress - swapStart) / (swapEnd - swapStart), 0, 1);

    copy.style.setProperty('--hero-fade', String(1 - swapT));
    copy.style.setProperty('--sub-fade', String(swapT));
    copy.classList.toggle('is-subheader', swapT > 0);
    reveal.setAttribute('aria-hidden', swapT >= 0.35 ? 'false' : 'true');
    reveal.classList.toggle('is-interactive', swapT >= 0.65);
  }

  function scheduleUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  scheduleUpdate();
})();
