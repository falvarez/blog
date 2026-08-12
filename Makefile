RSYNC := /opt/homebrew/bin/rsync

.PHONY: run build generate-prod deploy update-deps check-orbstack

run: check-orbstack
	docker compose up --build

build: check-orbstack
	docker compose build

generate-prod: check-orbstack
	docker compose run --rm -v "$(PWD)/output_prod:/app/output_prod" sculpin sh -c "composer install --no-interaction --no-ansi --no-progress && php -d intl.default_locale=es_ES vendor/bin/sculpin generate --env=prod --url=https://blog.falvarez.es"

update-deps: check-orbstack
	docker compose run --rm sculpin sh -c "composer update --no-interaction --no-ansi --no-progress"

deploy: generate-prod
	$(RSYNC) -avze 'ssh' --iconv=utf-8-mac,utf-8 --exclude=".DS_Store" --exclude="*.bak" --delete output_prod/ fspeccyorg:/var/www/falvarez/blog.falvarez.es/public_html

check-orbstack:
	@if ! orbctl status 2>&1 | grep -q "Running"; then \
		echo "OrbStack is not running. Starting OrbStack..."; \
		orbctl start; \
		echo "Waiting for OrbStack to start..."; \
		while ! docker info > /dev/null 2>&1; do \
			sleep 1; \
		done; \
	fi