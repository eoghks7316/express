var express = require('express')
var fs = require('fs');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');
var helmet = require('helmet')

var session = require('express-session')
var FileStore = require('session-file-store')(session)

var authData = {
  email: 'abcde1234@naver.com',
  password: '1111',
  nickname: 'admin'
}

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

/*********** Passport ************/
//session 다음에 passport코드가 등장해야한다.
var passport = require('passport');
var LocalStrategy = require('passport-local');
//local => ID, Password로 로그인

app.use(passport.initialize());
app.use(passport.session()); //내부적으로는 세션을 이용

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      email: user.email,
      nickname: user.nickname
    })
  });
});

passport.deserializeUser(function (user, cb) {

  process.nextTick(function () {
    return cb(null, authData);
  });
}); //로그인 성공후

//로그인 성공/실패 결정
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'pwd'
  },
  function (username, password, done) {
    if (username === authData.email) {
      if (password === authData.password) {
        return done(null, authData);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } else {
      return done(null, false, { message: 'Incorrect username.' });
    }
  }

));

//로그인 성공/실패후 처리
app.post('/auth/login_process', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));



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
