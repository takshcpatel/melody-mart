const App = {
  init() {
    this.setActiveNav();
    this.initMobileMenu();
  },

  setActiveNav() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href').replace(/\/$/, '') || '/';
      const normalizedHref = href.replace(/\.html$/, '');
      const normalizedPath = path.replace(/\.html$/, '');
      if (normalizedPath === normalizedHref ||
          (normalizedPath === '/' && (normalizedHref === '/' || normalizedHref === '/index'))) {
        link.classList.add('active');
      }
    });
  },

  initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
