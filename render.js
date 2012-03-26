/*!
 * connect-render
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var http = require('http');
var ejs = require('ejs');

var settings = {
  root: __dirname + '/views',
  cache: true,
  layout: 'layout.html'
};

var cache = {};

/**
 * connect-render: Template Render helper for connect
 * 
 * Use case:
 * 
 * var render = require('./lib/render');
 * var connect = require('connect');
 * 
 * connect(
 *   render({
 *     root: __dirname + '/views',
 *     cache: true, // must set `true` in production env
 *     layout: 'layout.html', // or false for no layout
 *     helpers: {
 *       config: config,
 *       sitename: 'NodeBlog Engine'
 *     }
 *   });
 * );
 * 
 * res.render('index.html', { title: 'Index Page', items: items });
 * 
 * // no layout 
 * res.render('blue.html', { items: items, layout: false });
 * 
 * @param {Object} [options={}] render options.
 * @return {Function} render middleware for `connect`
 */
module.exports = function(options) {
  options = options || {};
  for (var k in options) {
    settings[k] = options[k];
  }
  return function(req, res, next) {
    req.next = next;
    res.req = req;
    res.render = render;
    next();
  };
};

module.exports._cache = cache;

/**
 * Render the view fill with options
 * 
 * @param  {String} view    view name.
 * @param  {Object} [options=null]
 */
function render(view, options) {
  options = options || {};
  if (settings.helpers) {
    for (var k in settings.helpers) {
      options[k] = settings.helpers[k];
    }
  }
  var self = this;
  // add request to options
  if (!options.request) {
    options.request = self.req;
  }
  // render view template
  _render(view, options, function(err, str) {
    if (err) {
      return self.req.next(err);
    }
    var layout = settings.layout;
    if (options.layout === false || !layout) {
      var buf = new Buffer(str);
      self.setHeader('Content-Length', buf.length);
      return self.end(buf);
    }
    // render layout template, add view str to layout's locals.body;
    options.body = str;
    _render(layout, options, function(err, str) {
      if (err) {
        return self.req.next(err);
      }
      var buf = new Buffer(str);
      self.setHeader('Content-Length', buf.length);
      self.end(buf);
    });
  });
  return this;
};

function _render_tpl(fn, options, callback) {
  try {
    var str = fn.call(options.scope, options);
  } catch(err) {
    return callback(err);
  }
  callback(null, str);
}

function _render(view, options, callback) {
  var view_path = path.join(settings.root, view);
  var fn = settings.cache && cache[view];
  if (fn) {
    return _render_tpl(fn, options, callback);
  }
  // read template data from view file
  fs.readFile(view_path, 'utf8', function(err, data) {
    if (err) {
      return callback(err);
    }
    var tpl = partial(data);
    fn = ejs.compile(tpl, { filename: view });
    if (settings.cache) {
      cache[view] = fn;
    }
    _render_tpl(fn, options, callback);
  });
};

var reg_meta = /[\\^$*+?{}.()|\[\]]/g;
var open = ejs.open || "<%";
var close = ejs.close || "%>";
var partial_pattern = new RegExp(open.replace(reg_meta, "\\$&") + 
  "[-=]\\s*partial\\((.+)\\)\\s*" + close.replace(reg_meta, "\\$&"), 'g');

/**
 * add support for <%- partial('view') %> function
 * rather than realtime compiling, this implemention simply statically 'include' the partial view file
 * 
 * @param {String} data
 * @param {String} [varname=null] view name for partial loop check.
 * @return {String}
 */
function partial(data, view_name) {
  return data.replace(partial_pattern, function(all, view) {
    view = view.match(/['"](.*)['"]/);    // get the view name
    if (!view || view[1] === view_name) {
      return "";
    } else {
      var view_path = path.join(settings.root, view[1]);
      var tpl = '';
      try {
        tpl = fs.readFileSync(view_path, 'utf8');
      } catch(e) {
        console.error("[connect-render] Error: cannot load view partial " + view_path);
        return "";
      }
      return partial(tpl, view[1]);
    }
  });
}