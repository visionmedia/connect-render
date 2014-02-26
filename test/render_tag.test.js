/*!
 * connect-render - test/render_tag.test.js
 * Copyright(c) 2013 JacksonTian <shyvo1987@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require('path');
var fs = require('fs');
var connect = require('connect');
var request = require('supertest');
var render = require('../lib/render');
var should = require('should');

var options = {
  root: path.join(__dirname, 'views'),
  layout: false,
  open: '{{',
  close: '}}',
  cache: true // `false` for debug
};

var app = connect(render(options));

app.use(function (req, res) {
  if (req.url === '/mustache') {
    return res.render('mustache.html', { name: 'fengmk2' });
  }

  res.render('index.html', { name: 'fengmk2' });
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  next(err);
});

describe('render', function () {
  describe('tag open/close', function () {
    it('should ok with {{}}', function (done) {
      request(app).get('/mustache')
      .expect(200)
      .expect('Hello, I am fengmk2.\n', done);
    });
  });
});
