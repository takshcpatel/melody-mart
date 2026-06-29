/**
 * Bootstrap Icons helper (CDN: bootstrap-icons)
 * https://icons.getbootstrap.com/
 */
const Icons = {
  bi(name, extraClass = '') {
    return `<i class="bi bi-${name} ${extraClass}" aria-hidden="true"></i>`;
  },

  logo() {
    return this.bi('music-note-beamed', 'icon-logo');
  },

  hero() {
    return `
      <div class="hero-bi-scene" aria-hidden="true">
        <div class="hero-bi-ring"></div>
        <div class="hero-bi-icons">
          <span class="hero-bi-item hero-bi-1">${this.bi('music-note-beamed')}</span>
          <span class="hero-bi-item hero-bi-2">${this.bi('soundwave')}</span>
          <span class="hero-bi-item hero-bi-3">${this.bi('vinyl')}</span>
          <span class="hero-bi-item hero-bi-4">${this.bi('mic')}</span>
          <span class="hero-bi-item hero-bi-5">${this.bi('headphones')}</span>
        </div>
        <div class="hero-bi-waveform">
          ${Array.from({ length: 12 }, (_, i) => `<span class="wave-bar" style="animation-delay:${i * 0.08}s"></span>`).join('')}
        </div>
        <p class="hero-bi-tagline">PRECISION · CRAFT · SOUND</p>
      </div>
    `;
  },

  category(id) {
    const map = {
      string: 'music-note-beamed',
      keyboard: 'keyboard',
      percussion: 'disc',
      wind: 'wind'
    };
    return this.bi(map[id] || 'music-note', 'icon-category');
  },

  stat(type) {
    const map = {
      catalog: 'collection',
      ai: 'cpu',
      quality: 'award',
      support: 'currency-rupee'
    };
    return this.bi(map[type] || 'collection', 'icon-stat');
  },

  pillar(type) {
    const map = {
      curated: 'bullseye',
      guidance: 'chat-square-text',
      expertise: 'mortarboard',
      value: 'graph-up-arrow'
    };
    return this.bi(map[type] || 'bullseye', 'icon-pillar');
  },

  process(step) {
    const map = {
      browse: 'search',
      compare: 'columns-gap',
      choose: 'check-circle'
    };
    return this.bi(map[step] || 'search', 'icon-process');
  },

  contact(type) {
    const map = {
      email: 'envelope',
      phone: 'telephone',
      location: 'geo-alt',
      hours: 'clock'
    };
    return this.bi(map[type] || 'envelope', 'icon-contact');
  },

  search() {
    return this.bi('search', 'icon-empty');
  },

  applyLogos() {
    document.querySelectorAll('.logo-icon').forEach(el => {
      el.innerHTML = this.logo();
    });
  }
};
