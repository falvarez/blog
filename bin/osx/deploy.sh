#!/bin/sh
rsync -avze 'ssh' --iconv=utf-8-mac,utf-8 --delete output_prod/ digitalocean:~/webapps/blog.falvarez.es/public_html
