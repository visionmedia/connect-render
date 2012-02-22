SRC = $(shell find lib -type f -name "*.test.js")
TESTS = test/*.js
TESTTIMEOUT = 1000
REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) --timeout $(TESTTIMEOUT) $(TESTS)

.PHONY: test