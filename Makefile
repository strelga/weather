.PHONY: test integration_test api_stub_test

REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER)

integration_test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		./test/integration \
		--timeout 5000 \
		--reporter $(REPORTER)

api_stub_test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		./test/api_stub \
		--timeout 5000 \
		--reporter $(REPORTER)

test_all: test integration_test api_stub_test