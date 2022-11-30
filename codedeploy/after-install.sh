#!/usr/bin/env bash
cd /var/www/app
yarn
pm2 restart ecosystem.config.js --env production
