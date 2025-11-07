const fs = require('fs');
const https = require('https');

const date = new Date();
date.setDate(date.getDate() - 1);
const m = date.getMonth() + 1;
const d = date.getDate();
const y = date.getFullYear() % 100;
const formatted = `${m}/${d}/${y}`;

// Read current CSV
let csv = '';
try {
  csv = fs.readFileSync('bitcoin-data.csv', 'utf8').trim();
} catch (e) {
  csv = '';
}

// Skip if already exists
if (csv.includes(`${formatted},`)) {
  console.log(`Skipped: ${formatted} already exists`);
  process.exit(0);
}

// Fetch price
https.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk.toString());
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      const price = Math.floor(json.bitcoin.usd);
      const line = `${formatted},${price}`;
      const newCsv = line + (csv ? '\n' + csv : '');
      fs.writeFileSync('bitcoin-data.csv', newCsv + '\n');
      console.log('Updated (top):', line);
    } catch (e) {
      console.error('Failed:', e.message);
    }
  });
}).on('error', (e) => console.error('Network error:', e.message));
