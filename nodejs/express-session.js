var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var app = express()

/**\
 session 미들웨어 -> req에 session추가 
 session 값 메모리에 저장 <기본> -> 서버를 껏다 키면 사라진다. => 휘발되지 않는곳에 저장해야한다.
 option
 secret : 필수 , 버전관리시 다른 값으로 대체해야한다. <비밀리에 가지고있어야한다.>
 resave : 그냥 fasle => session 디렉토리 값이 바뀌기 전까지 세션저장소의 값을 가지지않는다.
 saveUninitialized : 그냥 true => 세션이 필요하기전까지는 세션을 구동시키지않는다.
 */
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}))


app.get('/', function (req, res, next) {
    console.log(req.session)
    if (req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num += 1;
    }
    res.send(`Views : ${req.session.num}`)
})

app.listen(3000)