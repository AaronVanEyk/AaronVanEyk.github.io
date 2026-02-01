// products.js

// === Step: Global products array for search/filter ===
let allProducts = []; // global

// === Step: Load CSV and populate products ===
async function loadProducts(csvPath) {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) throw new Error(`Failed to fetch ${csvPath}`);
    const text = await response.text();
    allProducts = parseCSV(text); // save globally for filtering/search
    renderProducts(allProducts);   // draw initial product cards
    populateTagFilter(allProducts); // fill dropdown
  } catch (err) {
    console.error(err);
    const container = document.getElementById('product-list');
    if (container) container.innerHTML = '<p>Failed to load products.</p>';
  }
}


// Render category page product cards safely
function renderProducts(list) {
  const container = document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = '';

  list.forEach((p, i) => {
    console.log('Rendering product:', p);

    // Guard against undefined/malformed product
    if (!p || !p.product_number) return;

    const div = document.createElement('div');
    div.className = 'product-card';

    // Use placeholder if image missing
    const imageSrc = `images/products/${p.product_number}.jpg`;

    // Template literal for the card
    div.innerHTML = `
      <a href="product.html?sku=${encodeURIComponent(p.product_number)}" class="product-link">
        <img
          src="${imageSrc}"
          alt="${p.name || 'Product image'}"
          class="product-image"
          loading="lazy"
          onerror="this.src='images/products/placeholder.jpg'"
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

function populateTagFilter(products) {
  const select = document.getElementById('tag-filter');
  if (!select) return;
  const tags = Array.from(new Set(products.flatMap(p => p.tags)));
  select.innerHTML = `<option value="">All Tags</option>`;
  tags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    select.appendChild(option);
  });
}

// real-time search input listener
function attachSearchListener() {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;

  searchInput.addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.tags.some(tag => tag.toLowerCase().includes(term))
    );
    renderProducts(filtered);
  });
}

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadProducts('data/connectors.csv');  // example CSV
  attachSearchListener();                // attach search listener
});
