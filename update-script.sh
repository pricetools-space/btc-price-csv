#!/bin/bash
DATE=$(TZ=America/New_York date -d "yesterday" +%m/%d/%Y)
PRICE=$(curl -s https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT | grep -o '"price":"[^"]*' | cut -d'"' -f4)
echo "$DATE,$PRICE" >> bitcoin-data.csv
git config user.name "cron-job"
git config user.email "cron@job.org"
git add bitcoin-data.csv
git commit -m "Daily BTC: $DATE"
git push
