FROM php:8.5-cli

RUN apt-get update && apt-get install -y \
        unzip git libicu-dev \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install intl

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /app
