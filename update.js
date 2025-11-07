const fs = require('fs');
const https = require('https');

// Yesterday in 11/6/25 format
const date = new Date();
date.setDate(date.getDate() - 1);
const m = date.getMonth() + 1;
const d = date.getDate();
const y = date.getFullYear() % 100;
const formatted = `${m}/${d}/${y}`;

// Fetch price
https.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk.toString());
  res.on('end', () => {
    try {
      const match = body.match(/"price":"([^"]+)"/);
      if (match) {
        const price = Math.floor(parseFloat(match[1]));
        const line = `${formatted},${price}\n`;
        fs.appendFileSync('bitcoin-data.csv', line);
        console.log('Updated:', line.trim());
      } else {
        console.log('No price found in response');
      }
    } catch (e) {
      console.error('Error:', e.message);
    }
  });
}).on('error', (e) => console.error('Network error:', e.message));
