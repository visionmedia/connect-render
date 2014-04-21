/*!
 * connect-render - lib/filters.js
 * Copyright(c) 2012 - 2014 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

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
