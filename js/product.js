function renderProduct(p) {
  const container = document.getElementById('product-details');

  if (!p) {
    container.textContent = 'Product not found.';
    return;
  }

  container.innerHTML = `
    <img
      src="${p.image}"
      alt="${p.name}"
      class="product-detail-image"
      onerror="this.src='images/products/placeholder.png'"
    >

    <h1>${p.name}</h1>
    <div class="sku">Product #${p.product_number}</div>
    <div class="price">$${p.price.toFixed(2)}</div>

    <div>
      ${p.inventory > 0
        ? `In stock: ${p.inventory}`
        : `<span class="out">Out of stock</span>`}
    </div>

    <p class="description">${p.description}</p>
    <div class="tags">${p.tags.join(', ')}</div>
  `;
}