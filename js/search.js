const FILES = ['data/connectors.csv','data/mounts.csv','data/antennas.csv'];
let allProducts = [];

Promise.all(FILES.map(f=>fetch(f).then(r=>r.text())))
  .then(texts=>texts.flatMap(parseCSV))
  .then(p=>allProducts=p);

document.getElementById('search')
  .addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const results = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.product_number.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    );
    renderResults(results);
  });

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
    o.tags=o.tags?o.tags.split('|'):[];
    return o;
  });
}

function renderResults(list){
  const container=document.getElementById('results');
  container.innerHTML='';
  list.forEach(p=>{
    const div=document.createElement('div');
    div.className='product';
    div.innerHTML=`
      <a href="product.html?sku=${encodeURIComponent(p.product_number)}" class="product-link">
        <div class="sku">#${p.product_number}</div>
        <h3>${p.name}</h3>
        <p class="description">${p.description}</p>
        <div class="tags">${p.tags.join(', ')}</div>
      </a>
    `;
    container.appendChild(div);
  });
}
