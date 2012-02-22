# connect-render

[![Build Status](https://secure.travis-ci.org/fengmk2/connect-render.png)](http://travis-ci.org/fengmk2/connect-render)

Template Render helper for [connect](https://github.com/senchalabs/connect).

## Usage

```
var connect = require('connect');
var render = require('../');

var app = connect(
  render({
    root: __dirname + '/views',
    layout: 'layout.html',
    cache: true // `false` for debug
  })
);

app.use(function(req, res) {
  res.render('index.html', { url: req.url });
});

app.listen(8080);
```