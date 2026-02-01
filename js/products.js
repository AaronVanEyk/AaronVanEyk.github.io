const params = new URLSearchParams(window.location.search);
const category = params.get('cat');

const CATEGORY_FILES = {
  connectors: 'data/connectors.csv',
  mounts: 'data/mounts.csv',
  antennas: 'data/antennas.csv'
};

if (!CATEGORY_FILES[category]) {
  document.getElementById('product-list').textContent = 'Invalid category.';
  throw new Error('Invalid category');
}

document.getElementById('category-title').textContent =
  category.charAt(0).toUpperCase() + category.slice(1);

let products = [];

fetch(CATEGORY_FILES[category])
  .then(r => r.text())
  .then(parseCSV)
  .then(p => {
    products = p;
    renderProducts(products);
    setupSorting();
  });

function setupSorting() {
  document.getElementById('sort-price')
    .addEventListener('change', e => {
      const v = e.target.value;
      const sorted = [...products];
      if(v==='asc') sorted.sort((a,b)=>a.price-b.price);
      if(v==='desc') sorted.sort((a,b)=>b.price-a.price);
      renderProducts(sorted);
    });
}

function renderProducts(list) {
  const container = document.getElementById('product-list');
  container.innerHTML='';
  list.forEach(p=>{
    const div=document.createElement('div');
    div.className='product';
    div.innerHTML=`
      <a href="product.html?sku=${encodeURIComponent(p.product_number)}" class="product-link">
        <div class="sku">#${p.product_number}</div>
        <h3>${p.name}</h3>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div>${p.inventory>0?`In stock: ${p.inventory}`:'<span class="out">Out of stock</span>'}</div>
        <p class="description">${p.description}</p>
        <div class="tags">${p.tags.join(', ')}</div>
      </a>
    `;
    container.appendChild(div);
  });
}