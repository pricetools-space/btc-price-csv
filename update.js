const fs = require('fs');
const https = require('https');

const date = new Date();
date.setDate(date.getDate() - 1);
const formatted = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

https.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      const price = Math.floor(parseFloat(json.price));
      const line = `${formatted},${price}\n`;
      fs.appendFileSync('bitcoin-data.csv', line);
      console.log('Updated:', line.trim());
    } catch (e) {
      console.error('Error:', e.message);
    }
  });
}).on('error', (e) => {
  console.error('Network error:', e.message);
});
