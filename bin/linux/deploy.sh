#!/bin/sh
rsync -avze 'ssh -p 24' --delete output_prod/ fede@digitalocean.falvarez.es:~/webapps/blog.falvarez.es/public_html
