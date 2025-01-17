.PHONY = run deploy

run:
	bin/run-dev.sh

deploy:
	bin/macos/generate-and-deploy.sh