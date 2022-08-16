var express = require('express')
var fs = require('fs');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');
var helmet = require('helmet')

var session = require('express-session')
var FileStore = require('session-file-store')(session)

const app = express()

/*********** Secure ************/
app.use(helmet());
/*********** Static File ************/
app.use(express.static('public'));

/*********** Middle ware ************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  //secure : true => https로만 session 정보 전달
  HttpOnly: true,//javascript 막기
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))

/*********** My Middle ware ************/
app.get('*', function (req, res, next) {
  fs.readdir('./data', function (error, filelist) {
    req.list = filelist;
    next();
  });
})

/*********** Router ************/
app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

/*********** Error ************/
app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
})

app.use(function (err, req, res, next)/*인자 4개 error 핸들링 함수*/ {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
/*********** listen ************/
app.listen(process.env.PORT | 3000, () => console.log('Example app listening on port 3000!'))
