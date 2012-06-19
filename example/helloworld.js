var connect = require('connect');
var render = require('../');

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

app.listen(8080, function () {
  console.log('Start listening on http://127.0.0.1:8080/');
});