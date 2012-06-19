# connect-render

[![Build Status](https://secure.travis-ci.org/fengmk2/connect-render.png)](http://travis-ci.org/fengmk2/connect-render)

Template Render helper using [ejs](https://github.com/visionmedia/ejs) for [connect](https://github.com/senchalabs/connect).

Support `connect` @1.8.x and @2.2.0+ .

## Test connect version

* 1.8.x: 1.8.0 1.8.5 1.8.6 1.8.7
* 2.2.x: 2.2.0 2.2.1 2.2.2 
* 2.3.x: 2.3.0 2.3.1 2.3.2 2.3.3

## Install

```bash
$ npm install connect-render
```

## Usage

```javascript
var connect = require('connect');
var render = require('connect-render');

var app = connect(
  render({
    root: __dirname + '/views',
    layout: 'layout.html',
    cache: true, // `false` for debug
    helpers: {
      sitename: 'connect-render demo site',
      starttime: new Date().getTime(),
      now: function (req, res) {
        return new Date();
      }
    }
  })
);

app.use(function (req, res) {
  res.render('index.html', { url: req.url });
});

app.listen(8080);
```

## License 

(The MIT License)

Copyright (c) 2012 fengmk2 &lt;fengmk2@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
