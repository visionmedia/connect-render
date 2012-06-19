SRC = $(shell find lib -type f -name "*.test.js")
TESTS = test/*.js
TESTTIMEOUT = 1000
REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha -R $(REPORTER) --timeout $(TESTTIMEOUT) $(TESTS)

test-cov: lib-cov
	@CONNECT_RENDER_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -rf ./$@
	@jscoverage lib $@

clean:
	@rm -rf lib-cov
	@rm -f coverage.html

.PHONY: test test-cov clean lib-cov