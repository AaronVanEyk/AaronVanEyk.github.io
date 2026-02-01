const FILES = ['data/connectors.csv','data/mounts.csv','data/antennas.csv'];
const params = new URLSearchParams(window.location.search);
const sku = params.get('sku');

if(!sku){document.getElementById('product-details').textContent='No product selected.'; throw new Error('SKU missing');}

let allProducts = [];

Promise.all(FILES.map(f=>fetch(f).then(r=>r.text())))
  .then(texts=>texts.flatMap(parseCSV))
  .then(p=>{allProducts=p; renderProduct(allProducts.find(p=>p.product_number===sku));});

function parseCSV(text){
  const rows=[]; let field='', row=[], inQuotes=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(c=='"'&&text[i+1]=='"'){field+='"';i++;} 
    else if(c=='"') inQuotes=!inQuotes;
    else if(c==','&&!inQuotes){row.push(field);field='';}
    else if(c=='\n'&&!inQuotes){row.push(field);rows.push(row);row=[];field='';}
    else field+=c;
  }
  row.push(field); rows.push(row);
  const headers=rows.shift();
  return rows.map(r=>{
    const o=Object.fromEntries(headers.map((h,i)=>[h,r[i]]));
    o.price=parseFloat(o.price);
    o.inventory=parseInt(o.inventory,10);
    o.tags=o.tags?o.tags.split('|'):[];
    return o;
  });
}

function renderProduct(p){
  const container=document.getElementById('product-details');
  if(!p){container.textContent='Product not found.'; return;}
  container.innerHTML=`
    <h1>${p.name}</h1>
    <div class="sku">Product #${p.product_number}</div>
    <div class="price">$${p.price.toFixed(2)}</div>
    <div>${p.inventory>0?`In stock: ${p.inventory}`:'<span class="out">Out of stock</span>'}</div>
    <p class="description">${p.description}</p>
    <div class="tags">${p.tags.join(', ')}</div>
  `;
}
