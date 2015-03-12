.PHONY: test integration_test

REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER)

integration_test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		./services/audio/test/integration \
		--reporter $(REPORTER)