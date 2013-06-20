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

  describe('fmoney()', function () {

    it('should throw RangeError', function () {
      (function () {
        filters.fmoney(1, -1);
        filters.fmoney(1, 21);
        filters.fmoney(1, -100);
        filters.fmoney(1, 100);
        filters.fmoney(1, Infinity);
        filters.fmoney(1, Number.MAX_VALUE);
        filters.fmoney(1, Number.MIN_VALUE);
      }).should.throw();
    });

    it('should return NaN', function () {
      isNaN(filters.fmoney()).should.ok;
      isNaN(filters.fmoney(NaN)).should.ok;
      isNaN(filters.fmoney(null)).should.ok;
      isNaN(filters.fmoney(undefined)).should.ok;
      isNaN(filters.fmoney('abc')).should.ok;
      isNaN(filters.fmoney('')).should.ok;
    });

    it('should return right string', function () {
      filters.fmoney(1, null).should.equal('1');
      filters.fmoney(1, undefined).should.equal('1');
      filters.fmoney(1, NaN).should.equal('1');
      filters.fmoney(1, 'abc').should.equal('1');

      filters.fmoney(1).should.equal('1');
      filters.fmoney(1000).should.equal('1,000');
      filters.fmoney(1000000).should.equal('1,000,000');
      filters.fmoney(1, 0).should.equal('1');
      filters.fmoney(1000, 0).should.equal('1,000');
      filters.fmoney(1000000, 0).should.equal('1,000,000');
      filters.fmoney(1, 1).should.equal('1.0');
      filters.fmoney(1, 1.1).should.equal('1.0');
      filters.fmoney(1, 1.4).should.equal('1.0');
      filters.fmoney(1, 1.5).should.equal('1.0');
      filters.fmoney(1, 1.6).should.equal('1.0');
      filters.fmoney(1, 1.9).should.equal('1.0');
      filters.fmoney(1000, 1).should.equal('1,000.0');
      filters.fmoney(1000000, 1).should.equal('1,000,000.0');
      filters.fmoney(1, 2).should.equal('1.00');
      filters.fmoney(1, 2.1).should.equal('1.00');
      filters.fmoney(1000, 2).should.equal('1,000.00');
      filters.fmoney(1000000, 2).should.equal('1,000,000.00');
      filters.fmoney(1, 20).should.equal('1.00000000000000000000');
      filters.fmoney(1000, 20).should.equal('1,000.00000000000000000000');
      filters.fmoney(1000000, 20).should.equal('1,000,000.00000000000000000000');
      
      filters.fmoney("12345.675910", 1).should.equal('12,345.7');
      filters.fmoney("12345.675910", 2).should.equal('12,345.68');
      filters.fmoney("12345.675910", 3).should.equal('12,345.676');

      filters.fmoney("12345.1234", 1).should.equal('12,345.1');
      filters.fmoney("12345.1234", 2).should.equal('12,345.12');
      filters.fmoney("12345.1234", 3).should.equal('12,345.123');

      filters.fmoney("12345.675910", 3).should.equal('12,345.676');

      for (var i = 1; i <= 20; i++) {
        var wanted = i + '.' + new Array(i + 1).join('0');
        filters.fmoney(i, i).should.equal(wanted);
        filters.fmoney(i, i + '.' + i).should.equal(wanted);
      }
    });

  });

  describe('dateformat()', function () {
    it('should reutrn empty string when input error', function () {
      filters.dateformat().should.equal('');
      filters.dateformat(null).should.equal('');
      filters.dateformat(0).should.equal('');
      filters.dateformat('').should.equal('');
      filters.dateformat('foo').should.equal('');
    });

    it('should work', function () {
      filters.dateformat('2012-11-11').should.equal('2012-11-11 00:00:00');
      filters.dateformat('2012-11-11 00').should.equal('2012-11-11 00:00:00');
      filters.dateformat(new Date()).should.match(/^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}$/);
      filters.dateformat(new Date('2012-11-11 00:00:01')).should.equal('2012-11-11 00:00:01');
    });
  });

});
