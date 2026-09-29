#!/bin/bash

set -e

cd /home/io-duyanh2108-sixforce/htdocs/duyanh.sixforce.io.vn

git pull origin main
npm ci --include=dev
npm run build
pm2 restart studynotion --update-env
pm2 save
