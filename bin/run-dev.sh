#!/usr/bin/env bash

# trap ctrl-c and call ctrl_c()
trap ctrl_c INT

function ctrl_c() {
    symfony server:stop
}

symfony server:ca:install
symfony server:start --document-root=output_prod -d

rm -rf output_prod
php -d intl.default_locale=es_ES vendor/bin/sculpin generate --watch --env=prod --url=https://127.0.0.1:8000
