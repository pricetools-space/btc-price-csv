const fs = require('fs');
const https = require('https');

const date = new Date();
date.setDate(date.getDate() - 1);
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate());  // No pad, single digit
const year = String(date.getFullYear()).slice(-2);  // 2-digit year
const formatted = `${month}/${day}/${year}`;

https.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      const price = Math.floor(parseFloat(json.price));  // No decimals
      const line = `${formatted},${price}\n`;
      fs.appendFileSync('bitcoin-data.csv', line);
      console.log('Updated:', line.trim());
    } catch (e) {
      console.error('Parse error:', e.message);
    }
  });
}).on('error', (e) => {
  console.error('Network error:', e.message);
});
