RSYNC := /opt/homebrew/bin/rsync

.PHONY: run build generate-prod deploy update-deps

run:
	docker compose up --build

build:
	docker compose build

generate-prod:
	docker compose run --rm sculpin sh -c "composer install --no-interaction --no-ansi --no-progress && php -d intl.default_locale=es_ES vendor/bin/sculpin generate --env=prod --url=https://blog.falvarez.es"

update-deps:
	docker compose run --rm sculpin sh -c "composer update --no-interaction --no-ansi --no-progress"

deploy: generate-prod
	$(RSYNC) -avze 'ssh' --iconv=utf-8-mac,utf-8 --exclude=".DS_Store" --exclude="*.bak" --delete output_prod/ fspeccyorg:/var/www/falvarez/blog.falvarez.es/public_html