TESTS = test/*.test.js
TIMEOUT = 1000
MOCHA_OPTS =
JSCOVERAGE = ./node_modules/jscover/bin/jscover
REPORTER = spec
SUPPORT_VERSIONS := \
	1.8.0 1.8.5 1.8.6 1.8.7 \
	1.9.0 1.9.1 1.9.2 \
	2.2.0 2.2.1 2.2.2 \
	2.3.0 2.3.1 2.3.2 2.3.3 2.3.4 2.3.5 2.3.6 2.3.7 2.3.8 2.3.9 \
	2.4.0 2.4.1 2.4.2 2.4.3 2.4.4 2.4.5 2.4.6

test:
	@NODE_ENV=test ./node_modules/.bin/mocha -R $(REPORTER) --timeout $(TIMEOUT) \
		$(MOCHA_OPTS) $(TESTS)

test-cov: lib-cov
	@CONNECT_RENDER_COV=1 $(MAKE) test REPORTER=dot
	@CONNECT_RENDER_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -rf $@
	@$(JSCOVERAGE) lib $@

clean:
	@rm -rf lib-cov
	@rm -f coverage.html

test-version:
	@npm install connect@$(v) --loglevel=warn
	@$(MAKE) test REPORTER=min

test-all-version:
	@for version in $(SUPPORT_VERSIONS); do \
		$(MAKE) test-version v=$$version; \
	done

.PHONY: test test-cov clean lib-cov test-version test-all-version