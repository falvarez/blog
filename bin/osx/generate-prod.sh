#!/bin/sh
rm -rf output_prod
vendor/bin/sculpin generate --env=prod --url=https://blog.falvarez.es
