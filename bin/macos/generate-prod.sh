#!/bin/sh
rm -rf output_prod
php -d intl.default_locale=es_ES vendor/bin/sculpin generate --env=prod --url=https://blog.falvarez.es

