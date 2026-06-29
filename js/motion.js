const Motion = {
  _observer: null,

  init() {
    Icons.applyLogos();
    this.applyDecorativeIcons();

    const heroEl = document.getElementById('hero-graphic');
    if (heroEl) heroEl.innerHTML = Icons.hero();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = document.querySelectorAll('.reveal');

    if (reduced) {
      reveals.forEach(el => el.classList.add('is-visible'));
      this.observeNewReveals = () => {
        document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => el.classList.add('is-visible'));
      };
      return;
    }

    // Hero should animate immediately on load
    document.querySelectorAll('.hero .reveal').forEach(el => {
      requestAnimationFrame(() => el.classList.add('is-visible'));
    });

    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this._observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => {
      if (!el.closest('.hero')) {
        this._observer.observe(el);
      }
    });

    this.observeNewReveals = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
        if (!el.classList.contains('is-visible')) {
          this._observer.observe(el);
        }
      });
    };
  },

  applyDecorativeIcons() {
    document.querySelectorAll('[data-stat]').forEach(el => {
      el.innerHTML = Icons.stat(el.dataset.stat);
    });
    document.querySelectorAll('[data-pillar]').forEach(el => {
      el.innerHTML = Icons.pillar(el.dataset.pillar);
    });
    document.querySelectorAll('[data-process]').forEach(el => {
      el.innerHTML = Icons.process(el.dataset.process);
    });
    document.querySelectorAll('[data-contact]').forEach(el => {
      el.innerHTML = Icons.contact(el.dataset.contact);
    });
    document.querySelectorAll('[data-about]').forEach(el => {
      el.innerHTML = Icons.pillar(el.dataset.about);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Motion.init());
