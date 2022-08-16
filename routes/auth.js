var express = require('express')
var router = express.Router()

var path = require('path');
var template = require('../lib/template.js');
var sanitizeHtml = require('sanitize-html');


//authData는 외부로 빼야하며 비밀번호는 암호화 필요, 비밀번호는 관리자도 못보게해야한다.
var authData = {
    email: 'zhfldk7316@naver.com',
    password: '1234',
    nickname: 'eoghks'
}

/*********** Login ************/
router.get('/login', function (req, res) {
    var title = 'WEB - Create';
    var list = template.list(req.list);
    var html = template.HTML(title, list, `
        <form action="/auth/login_process" method="post">
          <p> <input type="text" name="email" placeholder="email"></p>
          <p> <input type="password" name="pwd" placeholder="password"></p>
          <p> <input type="submit" value="login"> </p>
        </form>
      `, '');
    res.send(html);
})

router.post('/login_process', function (req, res) {
    var post = req.body;
    var email = post.email;
    var password = post.pwd;
    if (email === authData.email && password === authData.password) {
        req.session.islogined = true;
        req.session.nickname = authData.nickname;
        req.session.save(function () {
            res.redirect('/');
        })
    } else {
        res.send("Who?")
    }

})

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect(`/`)
    });
})


module.exports = router;