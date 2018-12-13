# ¡VAPF!

Sculpin code for my personal blog ¡VAPF!

Powered by [Sculpin](http://sculpin.io).

Inspired by [Sculpin blog skeleton code](https://github.com/sculpin/sculpin-blog-skeleton).

Needs to have PHP installed locally on your machine.

## Publishing Production Builds

When `--env=prod` is specified, the site will be generated in `output_prod/`. This
is the location of your production build.

```bash
sculpin generate --env=prod
```

These files are suitable to be transferred directly to a production host. For example:

```bash
sculpin generate --env=prodrsync -avze 'ssh -p 999' output_prod/ user@yoursculpinsite.com:public_html

```

If you want to make sure that rsync deletes files that you deleted locally on the on the remote too, add the `--delete` option to the rsync command:

```bash
rsync -avze 'ssh -p 999' --delete output_prod/ user@yoursculpinsite.com:public_html
```


## Development environment

I use [Symfony CLI tool](https://symfony.com/doc/master/cloud/getting-started) to run a standalone PHP server.

To start server:

```bash
./bin/run_dev.sh
```

Blog will be accesible at the following URL: https://127.0.0.1:8000
