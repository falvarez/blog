.PHONY: run build

run:
	docker compose up --build

build:
	docker compose build