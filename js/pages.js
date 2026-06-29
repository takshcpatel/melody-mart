async function initProductsPage() {
  const grid = document.getElementById('products-grid');
  const info = document.getElementById('search-results-info');

  try {
    await Catalog.load();
  } catch (err) {
    if (grid) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${Icons.search()}</div>
          <h3>Could not load products</h3>
          <p>Please refresh the page or try again later.</p>
        </div>
      `;
    }
    if (info) info.textContent = '';
    return;
  }

  const categories = Catalog.getCategories();

  const categorySelect = document.getElementById('filter-category');
  if (categorySelect) {
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  }

  function applyFilters() {
    const filters = {
      query: document.getElementById('search-query')?.value || '',
      category: document.getElementById('filter-category')?.value || 'all',
      minPrice: document.getElementById('filter-min-price')?.value || '',
      maxPrice: document.getElementById('filter-max-price')?.value || ''
    };

    const results = Catalog.search(filters);
    Catalog.renderProductsGrid(results, 'products-grid');

    const info = document.getElementById('search-results-info');
    if (info) {
      info.textContent = `Showing ${results.length} of ${Catalog.getProducts().length} instruments`;
    }
  }

  document.getElementById('search-btn')?.addEventListener('click', applyFilters);
  document.getElementById('search-query')?.addEventListener('input', applyFilters);
  document.getElementById('filter-category')?.addEventListener('change', applyFilters);
  document.getElementById('filter-min-price')?.addEventListener('change', applyFilters);
  document.getElementById('filter-max-price')?.addEventListener('change', applyFilters);

  const params = new URLSearchParams(window.location.search);
  if (params.get('category')) {
    document.getElementById('filter-category').value = params.get('category');
  }

  applyFilters();
}

async function initHomePage() {
  await Catalog.load();

  const featured = Catalog.getFeatured();
  Catalog.renderProductsGrid(featured, 'featured-products');

  const categories = Catalog.getCategories();
  const catGrid = document.getElementById('categories-grid');
  if (catGrid) {
    catGrid.innerHTML = categories.map((cat, i) => `
      <a href="/products.html?category=${cat.id}" class="category-card reveal${i ? ` reveal-delay-${Math.min(i, 3)}` : ''}">
        <div class="category-icon">${Icons.category(cat.id)}</div>
        <h3>${cat.name}</h3>
      </a>
    `).join('');
    Motion.observeNewReveals?.();
  }
}

async function initProductDetailPage() {
  const container = document.getElementById('product-detail-content');
  if (!container) return;

  try {
    await Catalog.load();
  } catch (err) {
    container.innerHTML = `
      <div class="container empty-state">
        <div class="empty-state-icon">${Icons.search()}</div>
        <h2>Could not load product</h2>
        <p>Please refresh the page or try again later.</p>
        <a href="/products.html" class="btn btn-primary" style="margin-top:1rem;">Browse Products</a>
      </div>
    `;
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    window.location.replace('/products.html');
    return;
  }

  const product = Catalog.getProductById(id);

  if (!product) {
    container.innerHTML = `
      <div class="container empty-state">
        <div class="empty-state-icon">${Icons.search()}</div>
        <h2>Product not found</h2>
        <p>The instrument you're looking for doesn't exist.</p>
        <a href="/products.html" class="btn btn-primary" style="margin-top:1rem;">Browse Products</a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} — MelodyMart`;

  const specsRows = Object.entries(product.specifications)
    .map(([key, val]) => `<tr><td>${key}</td><td>${val}</td></tr>`)
    .join('');

  const featuresList = product.features
    .map(f => `<li>${f}</li>`)
    .join('');

  const imgSrc = Catalog.getImageSrc(product);
  const fallbackImg = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80';

  container.innerHTML = `
    <div class="container product-detail-grid">
      <div class="product-detail-image">
        <img src="${imgSrc}" alt="${product.name}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallbackImg}'">
      </div>
      <div class="product-detail-info">
        <p class="product-category">${product.categoryName}</p>
        <h1>${product.name}</h1>
        <p class="product-detail-price">${Catalog.formatPrice(product.price)}</p>
        <div class="product-detail-meta">
          <span class="meta-tag">${product.skillLevel} level</span>
          ${product.genres.map(g => `<span class="meta-tag">${g}</span>`).join('')}
        </div>
        <p>${product.description}</p>

        <h3 class="product-section-title">Specifications</h3>
        <table class="specs-table">${specsRows}</table>

        <div class="features-list">
          <h3>Key Features</h3>
          <ul>${featuresList}</ul>
        </div>

        <div class="product-detail-actions">
          <a href="/products.html" class="btn btn-outline">← Back to Products</a>
        </div>
      </div>
    </div>
  `;

  const related = Catalog.getRelated(product.id);
  const relatedSection = document.getElementById('related-products');
  if (related.length > 0 && relatedSection) {
    relatedSection.style.display = 'block';
    Catalog.renderProductsGrid(related, 'related-grid');
  }
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  switch (page) {
    case 'home': initHomePage(); break;
    case 'products': initProductsPage(); break;
    case 'product-detail': initProductDetailPage(); break;
    case 'contact': initContactForm(); break;
  }
});
