// utils.js
function parseCSV(text) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"' && text[i + 1] === '"') {
      field += '"';
      i++;
    } else if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if (c === '\n' && !inQuotes) {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  row.push(field);
  rows.push(row);

  const headers = rows.shift();

  return rows
    .filter(r => r.some(cell => cell.trim() !== ''))
    .map(r => {
      const obj = Object.fromEntries(headers.map((h, i) => [h, r[i]]));

      obj.price = parseFloat(obj.price);
      obj.inventory = parseInt(obj.inventory, 10);
      obj.tags = obj.tags && obj.tags.length > 0 ? obj.tags.split('|') : [];

      // 🔥 Image derived from product number
      obj.image = `images/products/${obj.product_number}.jpg`;

      return obj;
    });
}
