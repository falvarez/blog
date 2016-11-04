#!/bin/sh
rsync -avze 'ssh -p 24' --iconv=utf-8-mac,utf-8 --delete output_prod/ fede@digitalocean.falvarez.es:~/webapps/blog.falvarez.es/public_html
