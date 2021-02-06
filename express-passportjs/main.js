var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
app.use(flash()); // session 뒤에 있어야 함, 미들웨어는 순서 중요

app.get('/flash', function (req, res) {
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('msg', 'Flash is back!')
  res.send('flash');
});

app.get('/flash-display', function (req, res) {
  var fmsg = req.flash();
  console.log(fmsg);
  res.send(fmsg);
  // Get an array of flash messages by passing the key to req.flash()
  // res.render('index', { messages: req.flash('info') });
});


var passport = require('./lib/passport')(app);
// passport 관련 코드들은 /lib/passport.js 로 리팩토링

// // passport.js 는 session 을 내부적으로 사용하기 때문에
// // 변수 선언은 앞에서 해도 되지만, 사용은 반드시 session 뒤에서 해야 된다

app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
