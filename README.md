¡VAPF!
=====================

Sculpin code for my personal blog ¡VAPF!

Powered by [Sculpin](http://sculpin.io).

Inspired by [Sculpin blog skeleton code](https://github.com/sculpin/sculpin-blog-skeleton).

Publishing Production Builds
----------------------------

When `--env=prod` is specified, the site will be generated in `output_prod/`. This
is the location of your production build.

    sculpin generate --env=prod

These files are suitable to be transferred directly to a production host. For example:

    sculpin generate --env=prod
    rsync -avze 'ssh -p 999' output_prod/ user@yoursculpinsite.com:public_html

If you want to make sure that rsync deletes files that you deleted locally on the on the remote too, add the `--delete` option to the rsync command:

    rsync -avze 'ssh -p 999' --delete output_prod/ user@yoursculpinsite.com:public_html
