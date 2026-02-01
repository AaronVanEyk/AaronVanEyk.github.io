function renderProducts(list) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  list.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';

    div.innerHTML = `
      <a href="product.html?sku=${encodeURIComponent(p.product_number)}" class="product-link">
        <img
          src="${p.image}"
          alt="${p.name}"
          class="product-image"
          loading="lazy"
          onerror="this.src='images/products/placeholder.png'"
        >
        <div class="sku">#${p.product_number}</div>
        <h3>${p.name}</h3>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div>
          ${p.inventory > 0
            ? `In stock: ${p.inventory}`
            : `<span class="out">Out of stock</span>`}
        </div>
        <p class="description">${p.description}</p>
        <div class="tags">${p.tags.join(', ')}</div>
      </a>
    `;
    container.appendChild(div);
  });
}