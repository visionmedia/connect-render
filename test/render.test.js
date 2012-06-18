/*!
 * connect-render - test/render.test.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var render = require('../');
var fs = require('fs');
var connect = require('connect');
var render = require('../');

var options = {
  root: __dirname + '/views',
  layout: 'layout.html',
  cache: true, // `false` for debug
  helpers: {
    sitename: 'connect-render demo site',
    starttime: new Date().getTime(),
    requestURL: function (req, res) {
      return req.url;
    }
  }
};

var app = connect(render(options));

app.use(function (req, res) {
  if (req.url === '/viewerror') {
    return res.render('noexists.html', { name: 'fengmk2' });
  }
  if (req.url === '/nolayout') {
    return res.render('nolayout.html', { layout: false });
  }
  if (req.url === '/partial_in_partial') {
    return res.render('./partial_in_partial.html', { layout: false });
  }
  if (req.url === '/partial_not_exists') {
    return res.render('partial_not_exists.html', { layout: false });
  }
  if (req.url === '/error') {
    return res.render('error.html');
  }
  if (req.url === '/options.scope') {
    return res.render('options.scope.html', { 
      layout: false, 
      scope: { name: 'scope test' } 
    });
  }
  res.render('index.html', { name: 'fengmk2' });
});

var success = fs.readFileSync(__dirname + '/success.html', 'utf8')
  .replace('$starttime$', options.helpers.starttime);


describe('render.js', function () {
  before(function (done) {
    app.listen(0, done);
  });

  describe('#render()', function () {
    it('should work', function (done) {
      render._cache.should.not.have.property('index.html');
      render._cache.should.not.have.property('layout.html');
      app.request().get('/').end(function (res) {
        res.should.status(200);
        res.body.toString().should.equal(success);
        render._cache.should.have.property('index.html');
        render._cache.should.have.property('layout.html');
        res.headers['content-length'].should.above(0);
        done();
      });
    });

    it('should error when view not exists', function (done) {
      app.request().get('/viewerror').end(function (res) {
        res.should.status(500);
        res.body.toString().should.include('Error: ENOENT, open');
        done();
      });
    });

    it('should return no layout', function (done) {
      app.request().get('/nolayout').end(function (res) {
        res.should.status(200);
        res.headers['content-length'].should.above(0);
        res.body.toString().should.equal('nolayout');
        done();
      });
    });

    it('should return 500 when template error', function (done) {
      app.request().get('/error').end(function (res) {
        res.should.status(500);
        res.body.toString().should.include('ReferenceError: error.html');
        done();
      });
    });

    it('should support options.scope', function (done) {
      app.request().get('/options.scope').end(function (res) {
        res.should.status(200);
        res.headers['content-length'].should.above(0);
        res.body.toString().should.equal('scope test');
        done();
      });
    });
  });

  describe('#partial()', function () {
    it('should fixed partial in partial', function (done) {
      app.request().get('/partial_in_partial').end(function (res) {
        res.should.status(200);
        res.headers['content-length'].should.above(0);
        res.body.toString().should.equal('partialpartial');
        done();
      });
    });

    it('should console.error when partial view not exists', function (done) {
      var _error = console.error;
      var errormsg = '';
      console.error = function (msg) {
        errormsg = msg;
      };
      app.request().get('/partial_not_exists').end(function (res) {
        res.should.status(200);
        res.headers['content-length'].should.above(0);
        res.body.toString().should.equal('partial_not_exists');
        console.error = _error;
        errormsg.should.include('[connect-render] Error: cannot load view partial');
        done();
      });
    });
  });
});