#!/bin/sh
rsync -avze 'ssh' --delete output_prod/ hetzner:~/webapps/blog.falvarez.es/public_html
