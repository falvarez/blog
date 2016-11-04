#!/bin/sh
vagrant up --provision
rm -rf output_prod
vendor/bin/sculpin generate --watch --env=prod --url=https://blog-dev.falvarez.es
