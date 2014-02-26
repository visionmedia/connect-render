/*!
 * connect-render - lib/filters.js
 * Copyright(c) 2012 - 2014 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var moment = require('moment');

var NO_ASCII_CHAR_RE = /[^\x00-\xff]/;

var TRUNCATE_PEDDING = '…';

/**
 * truncatechars with max unicode length
 * e.g.:
 *
 * ```js
 * truncatechars('你好吗?', 3); // => '你好…'
 * truncatechars('hello', 2); // => 'he…'
 * ```
 *
 * @param {String} text
 * @param {Number} max, max string length.
 * @return {String}
 * @public
 */
exports.truncatechars = function (text, max) {
  if (!max) {
    throw new Error('`max` must be inter and above 0');
  }
  if (text === null || text === undefined) {
    return '';
  }
  if (typeof text === 'string') {
    text = text.trim();
  } else {
    text = String(text);
  }
  if (text === '') {
    return text;
  }

  var len = Math.round(text.replace(/[^\x00-\xff]/g, 'qq').length / 2);
  if (len > max) {
    var index = 0;
    for (var j = 0, l = max - 1; j < l; index++) {
      if (NO_ASCII_CHAR_RE.test(text[index])) {
        j += 1;
      } else {
        j += 0.5;
      }
    }
    text = text.substring(0, index) + TRUNCATE_PEDDING;
  }
  return text;
};

/**
 * Show money format with decimal digits.
 *
 * e.g.:
 *
 * ```js
 * fmoney("12345.675910", 3); // => 12,345.676
 * ```
 *
 * @param {String|Number} s
 * @param {Number} n, decimal digits.
 * @return {String}
 */
exports.fmoney = function fmoney(s, n) {
  s = parseFloat((s + "").replace(/[^\d\.\-]/g, ""));
  if (isNaN(s)) {
    return s;
  }
  var lr = (s.toFixed(n || 0) + '').split('.');
  var l = lr[0].split('').reverse();
  var t = [];
  for (var i = 0, len = l.length, last = len - 1; i < len; i++) {
    t.push(l[i]);
    if ((i + 1) % 3 === 0 && i !== last) {
      t.push(',');
    }
  }
  t = t.reverse();
  if (lr[1]) {
    t.push('.');
    t.push(lr[1]);
  }
  return t.join('');
};

/**
 * Format DateTime to string.
 *
 * @see http://momentjs.com/docs/#/displaying/format/
 * @param {Date} d
 * @param {String} format, default is 'YYYY-MM-DD HH:mm:ss'.
 * @return {String}
 */
exports.dateformat = function (d, format) {
  var date = moment(d);
  if (!d || !date || !date.isValid()) {
    return '';
  }
  return date.format(format || 'YYYY-MM-DD HH:mm:ss');
};
