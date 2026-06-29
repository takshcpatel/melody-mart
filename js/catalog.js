const Catalog = {
  data: null,

  async load() {
    if (this.data) return this.data;
    const res = await fetch('/data/products.json');
    if (!res.ok) throw new Error('Failed to load product catalog');
    this.data = await res.json();
    return this.data;
  },

  getProducts() {
    return (this.data?.products || []).filter(p => p.id && p.name && p.price != null);
  },

  getCategories() {
    return this.data?.categories || [];
  },

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  },

  getFeatured() {
    return this.getProducts().filter(p => p.featured);
  },

  formatPrice(price) {
    const symbol = MELODYMART_CONFIG.currencySymbol;
    const amount = Number(price);
    if (!Number.isFinite(amount)) return `${symbol}—`;
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  },

  search(filters = {}) {
    let results = [...this.getProducts()];
    const { query, category, minPrice, maxPrice } = filters;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.genres.some(g => g.includes(q))
      );
    }

    if (category && category !== 'all') {
      results = results.filter(p => p.category === category);
    }

    if (minPrice !== undefined && minPrice !== '') {
      results = results.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      results = results.filter(p => p.price <= Number(maxPrice));
    }

    return results;
  },

  getRelated(productId, limit = 3) {
    const product = this.getProductById(productId);
    if (!product) return [];
    return this.getProducts()
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, limit);
  },

  getImageSrc(product) {
    return product.image || `/assets/images/${product.id}.svg`;
  },

  imageFallback(el) {
    el.onerror = () => {
      el.onerror = null;
      el.src = '/assets/images/placeholder.svg';
    };
  },

  renderProductCard(product) {
    const imgSrc = this.getImageSrc(product);
    return `
      <article class="product-card">
        <a href="/product.html?id=${product.id}" class="product-card-image">
          <img src="${imgSrc}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80'">
          ${product.featured ? '<span class="product-badge">Featured</span>' : ''}
        </a>
        <div class="product-card-body">
          <p class="product-category">${product.categoryName}</p>
          <h3><a href="/product.html?id=${product.id}">${product.name}</a></h3>
          <p class="product-price">${this.formatPrice(product.price)}</p>
          <div class="product-card-actions">
            <a href="/product.html?id=${product.id}" class="btn btn-primary btn-sm">View Details</a>
          </div>
        </div>
      </article>
    `;
  },

  renderProductsGrid(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${Icons.search()}</div>
          <h3>No instruments found</h3>
          <p>Try adjusting your search filters.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(p => this.renderProductCard(p)).join('');
  },
};
