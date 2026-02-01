// product.js

// Load a single product by SKU
async function loadProduct(csvPath) {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) throw new Error(`Failed to fetch ${csvPath}`);
    const text = await response.text();
    const products = parseCSV(text);

    const params = new URLSearchParams(window.location.search);
    const sku = params.get('sku');
    const product = products.find(p => p.product_number === sku);

    renderProduct(product);
  } catch (err) {
    console.error('Error loading product:', err);
    const container = document.getElementById('product-details');
    if (container) container.innerHTML = '<p>Failed to load product.</p>';
  }
}

// Render the product detail safely
function renderProduct(p) {
  const container = document.getElementById('product-details');

  // Step 2: guard against undefined/malformed product
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