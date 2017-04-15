#!/bin/sh
vagrant up
rm -rf output_prod
vendor/bin/sculpin generate --watch --env=prod --url=https://blog-dev.falvarez.es
