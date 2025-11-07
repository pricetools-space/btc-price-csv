const fs = require('fs');
const https = require('https');

const date = new Date();
date.setDate(date.getDate() - 1);
const formatted = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

https.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const price = JSON.parse(data).price;
    fs.appendFileSync('bitcoin-data.csv', `${formatted},${price}\n`);
    console.log('Updated:', formatted, price);
  });
}).on('error', (e) => console.error(e));
