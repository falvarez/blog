#!/bin/sh
rm -rf output_prod
php -d intl.default_locale=es_ES vendor/bin/sculpin generate --watch --env=prod --url=https://blog-dev.falvarez.es
