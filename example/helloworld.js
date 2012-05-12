var connect = require('connect');
var render = require('../');

var app = connect(
  render({
    root: __dirname + '/views',
    layout: 'layout.html',
    cache: true, // `false` for debug
    helpers: {
      sitename: 'connect-render demo site',
      starttime: new Date().getTime()
    }
  })
);

app.use(function (req, res) {
  res.render('index.html', { url: req.url });
});

app.listen(8080);