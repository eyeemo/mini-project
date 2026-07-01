# ─────────────────────────────────────────────────────────────
# Stage 1 — bina asset frontend (Vue/Vite) guna Node
# ─────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS frontend
WORKDIR /app

# Pasang dependency dulu (cache lebih baik)
COPY package*.json vite.config.js ./
RUN npm ci || npm install

# Salin sumber yang perlu untuk build
COPY resources ./resources
# Tailwind @source merujuk folder ni — cipta supaya tak error masa build
RUN mkdir -p vendor/laravel/framework/src/Illuminate/Pagination/resources/views \
    && mkdir -p storage/framework/views public

# Bina asset. Kalau gagal sebab binding rolldown hilang (bug npm),
# pasang binding Linux versi yang sepadan, lepas tu cuba semula.
RUN npm run build || ( \
      BINDING="@rolldown/binding-linux-x64-gnu@$(node -p "require('./node_modules/rolldown/package.json').version")" && \
      npm install "$BINDING" --no-save && \
      npm run build )

# ─────────────────────────────────────────────────────────────
# Stage 2 — aplikasi PHP (Laravel) atas Apache
# ─────────────────────────────────────────────────────────────
FROM php:8.3-apache-bookworm AS app

# Extension PHP + tools yang perlu
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev libzip-dev unzip git \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Apache: docroot -> /public, benarkan .htaccess (rewrite Laravel)
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN a2enmod rewrite \
    && sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's!/var/www/!${APACHE_DOCUMENT_ROOT}/!g' /etc/apache2/apache2.conf \
    && sed -ri 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

WORKDIR /var/www/html

# Salin aplikasi + pakej PHP
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Salin asset yang dah dibina dari Stage 1
COPY --from=frontend /app/public/build ./public/build

# Pastikan folder storage wujud + kebenaran betul
RUN mkdir -p storage/logs \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/views \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Skrip mula
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 10000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
