#!/bin/sh
rsync -avze 'ssh' --iconv=utf-8-mac,utf-8 --exclude=".DS_Store" --delete output_prod/ hetzner:~/webapps/blog.falvarez.es/public_html
