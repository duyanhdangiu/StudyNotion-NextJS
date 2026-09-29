#!/bin/bash

set -e

cd /home/io-duyanh2108-sixforce/htdocs/duyanh.sixforce.io.vn

git pull origin main
npm ci
npm run build
pm2 restart studynotion
pm2 save
