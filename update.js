const fs = require('fs');
const https = require('https');

const date = new Date();
date.setDate(date.getDate() - 1);
const m = date.getMonth() + 1;
const d = date.getDate();
const y = date.getFullYear() % 100;
const formatted = `${m}/${d}/${y}`;

https.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk.toString());
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      const price = Math.floor(json.bitcoin.usd);
      const line = `${formatted},${price}\n`;
      fs.appendFileSync('bitcoin-data.csv', line);
      console.log('Updated:', line.trim());
    } catch (e) {
      console.log('Raw response:', body);
      console.error('Failed:', e.message);
    }
  });
}).on('error', (e) => {
  console.error('Network error:', e.message);
});
