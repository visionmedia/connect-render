/*!
 * connect-render - test/filters.test.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var filters = require('../').filters;

describe('filters.test.js', function () {
  describe('truncatechars()', function () {
    it('should throw error when max not set or set wrong value', function () {
      (function () {
        filters.truncatechars();
      }).should.throw();
      (function () {
        filters.truncatechars('foo');
      }).should.throw();
      (function () {
        filters.truncatechars(123, 0);
      }).should.throw();
      (function () {
        filters.truncatechars(123, null);
      }).should.throw();
      (function () {
        filters.truncatechars(123, null);
      }).should.throw();
    });

    it('should return empty string when text null', function () {
      filters.truncatechars(undefined, 10).should.equal('');
      filters.truncatechars(null, 10).should.equal('');
    });

    it('should worked', function () {
      var p = '…';
      filters.truncatechars('', 10).should.equal('');
      filters.truncatechars(0, 10).should.equal('0');
      filters.truncatechars(false, 10).should.equal('false');
      filters.truncatechars(true, 10).should.equal('true');
      filters.truncatechars('undefined', 30).should.equal('undefined');
      filters.truncatechars('undefined', 3).should.equal('unde' + p);
      filters.truncatechars(112233, 3).should.equal('112233');
      filters.truncatechars('112233', 3).should.equal('112233');
      filters.truncatechars('我111', 3).should.equal('我111');
      filters.truncatechars('我1111', 3).should.equal('我1111');
      filters.truncatechars('我11111', 3).should.equal('我11' + p);
      filters.truncatechars('11111我', 3).should.equal('1111' + p);
      filters.truncatechars('我是谁', 3).should.equal('我是谁');
      filters.truncatechars('11223344?!', 3).should.equal('1122' + p);
      filters.truncatechars('我是谁啊?!', 3).should.equal('我是' + p);
      filters.truncatechars('11223344', 3).should.equal('1122' + p);
      filters.truncatechars(11223344, 3).should.equal('1122' + p);
      filters.truncatechars('我是谁啊', 3).should.equal('我是' + p);
      filters.truncatechars('你好吗', 2).should.equal('你' + p);
      filters.truncatechars('你好吗', 1).should.equal('' + p);
      filters.truncatechars('你好吗?', 2).should.equal('你' + p);
      filters.truncatechars('你好吗?', 3).should.equal('你好' + p);
      filters.truncatechars('你好吗', 3).should.equal('你好吗');
      filters.truncatechars('hello2', 2).should.equal('he' + p);
    });
  });
});
