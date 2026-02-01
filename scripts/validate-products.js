// scripts/validate-products.js
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const CSV_FILES = [
  'connectors.csv',
  'mounts.csv',
  'antennas.csv'
];

const REQUIRED_HEADERS = [
  'product_number',
  'name',
  'price',
  'inventory',
  'description',
  'tags'
];

// Load allowed tags
const allowedTags = fs
  .readFileSync(path.join(DATA_DIR, 'allowed-tags.txt'), 'utf8')
  .split('\n')
  .map(t => t.trim())
  .filter(Boolean);

const seenProductNumbers = new Set();

CSV_FILES.forEach(file => {
  validateCSV(path.join(DATA_DIR, file));
});

console.log('✅ All product CSV files passed validation');


// -----------------------------

function validateCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing file: ${filePath}`);
  }

  const text = fs.readFileSync(filePath, 'utf8').trim();
  const rows = parseCSV(text);

  const headers = rows.shift();
  REQUIRED_HEADERS.forEach(h => {
    if (!headers.includes(h)) {
      fail(`${filePath}: missing required column "${h}"`);
    }
  });

  rows.forEach((row, index) => {
    const line = index + 2;
    const record = Object.fromEntries(
      headers.map((h, i) => [h, row[i]])
    );

    // Product number
    if (!record.product_number) {
      fail(`${filePath} line ${line}: missing product_number`);
    }
    if (seenProductNumbers.has(record.product_number)) {
      fail(`${filePath} line ${line}: duplicate product_number "${record.product_number}"`);
    }
    seenProductNumbers.add(record.product_number);

    // Name
    if (!record.name) {
      fail(`${filePath} line ${line}: missing name`);
    }

    // Price
    const price = parseFloat(record.price);
    if (isNaN(price) || price < 0) {
      fail(`${filePath} line ${line}: invalid price "${record.price}"`);
    }

    // Inventory
    const inventory = Number(record.inventory);
    if (!Number.isInteger(inventory) || inventory < 0) {
      fail(`${filePath} line ${line}: invalid inventory "${record.inventory}"`);
    }

    // Description
    if (!record.description) {
      fail(`${filePath} line ${line}: missing description`);
    }

    // Tags
    if (record.tags) {
      record.tags.split('|').forEach(tag => {
        if (!allowedTags.includes(tag)) {
          fail(`${filePath} line ${line}: invalid tag "${tag}"`);
        }
      });
    }
  });
}


// -----------------------------
// CSV parser with multiline support
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
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
  return rows;
}

function fail(message) {
  console.error(`❌ CSV validation failed:\n${message}`);
  process.exit(1);
}
