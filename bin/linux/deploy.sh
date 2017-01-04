#!/bin/sh
rsync -avze 'ssh' --delete output_prod/ digitalocean:~/webapps/blog.falvarez.es/public_html
