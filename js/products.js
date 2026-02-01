// products.js
console.log('products.js loaded');
// Fetch and render products for category page
async function loadProducts(csvPath) {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) throw new Error(`Failed to fetch ${csvPath}`);
    const text = await response.text();
    const products = parseCSV(text);
    renderProducts(products);
  } catch (err) {
    console.error('Error loading products:', err);
    const container = document.getElementById('product-list');
    if (container) container.innerHTML = '<p>Failed to load products.</p>';
  }
}

// Render category page product cards safely
function renderProducts(list) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  list.forEach(p => {
    // Step 2: guard against undefined/malformed products
    if (!p || !p.product_number) return;

    const div = document.createElement('div');
    div.className = 'product';

    const imageSrc = `images/products/${p.product_number}.jpg`;

    div.innerHTML = `
      <a href="product.html?sku=${encodeURIComponent(p.product_number)}" class="product-link">
        <img
          src="${imageSrc}"
          alt="${p.name || 'Product image'}"
          class="product-image"
          loading="lazy"
          onerror="this.src='images/products/placeholder.png'"
        >
        <div class="sku">#${p.product_number}</div>
        <h3>${p.name || 'Unnamed Product'}</h3>
        <div class="price">$${p.price ? p.price.toFixed(2) : '0.00'}</div>
        <div>
          ${p.inventory && p.inventory > 0
            ? `In stock: ${p.inventory}`
            : `<span class="out">Out of stock</span>`}
        </div>
        <p class="description">${p.description || ''}</p>
        <div class="tags">${p.tags && p.tags.length ? p.tags.join(', ') : ''}</div>
      </a>
    `;
    container.appendChild(div);
  });
}

// Render product detail page safely
function renderProduct(p) {
  const container = document.getElementById('product-details');

  if (!p || !p.product_number) {
    container.textContent = 'Product not found.';
    return;
  }

  const imageSrc = `images/products/${p.product_number}.jpg`;

  container.innerHTML = `
    <img
      src="${imageSrc}"
      alt="${p.name || 'Product image'}"
      class="product-detail-image"
      onerror="this.src='images/products/placeholder.png'"
    >

    <h1>${p.name || 'Unnamed Product'}</h1>
    <div class="sku">Product #${p.product_number}</div>
    <div class="price">$${p.price ? p.price.toFixed(2) : '0.00'}</div>

    <div>
      ${p.inventory && p.inventory > 0
        ? `In stock: ${p.inventory}`
        : `<span class="out">Out of stock</span>`}
    </div>

    <p class="description">${p.description || ''}</p>
    <div class="tags">${p.tags && p.tags.length ? p.tags.join(', ') : ''}</div>
  `;
}
