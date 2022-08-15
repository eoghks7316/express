var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')

var app = express()

/**
 option
 secret : 필수 , 버전관리시 다른 값으로 대체해야한다. <비밀리에 가지고있어야한다.>
 resave : 그냥 fasle => session 디렉토리 값이 바뀌기 전까지 세션저장소의 값을 가지지않는다.
 saveUninitialized : 그냥 true => 세션이 필요하기전까지는 세션을 구동시키지않는다.
 */
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))


app.get('/', function (req, res, next) {
    res.send('Hello Session!! ')
})

app.listen(3000)