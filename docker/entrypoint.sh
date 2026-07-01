#!/usr/bin/env bash
set -e

# Render bekalkan PORT (lalai 10000). Apache kena dengar pada port ni.
: "${PORT:=10000}"

# Guna URL awam Render untuk APP_URL + Sanctum (login cookie bergantung pada domain).
if [ -n "$RENDER_EXTERNAL_URL" ]; then
  export APP_URL="$RENDER_EXTERNAL_URL"
fi
if [ -n "$RENDER_EXTERNAL_HOSTNAME" ]; then
  export SANCTUM_STATEFUL_DOMAINS="$RENDER_EXTERNAL_HOSTNAME"
fi

# Set Apache dengar pada $PORT
sed -ri "s!^Listen 80\$!Listen ${PORT}!" /etc/apache2/ports.conf
sed -ri "s!<VirtualHost \*:80>!<VirtualHost *:${PORT}>!" /etc/apache2/sites-available/000-default.conf

# Sediakan Laravel (idempotent — selamat diulang setiap deploy)
php artisan config:clear
php artisan migrate --force
php artisan db:seed --force || true
php artisan config:cache

# Mula pelayan web
exec apache2-foreground
