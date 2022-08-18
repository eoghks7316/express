var express = require('express')
var router = express.Router()

var path = require('path');
var template = require('../lib/template.js');
var sanitizeHtml = require('sanitize-html');


//authData는 외부로 빼야하며 비밀번호는 암호화 필요, 비밀번호는 관리자도 못보게해야한다.



module.exports = function (passport) {
  /*********** Login ************/
  router.get('/login', function (req, res) {
    var fmsg = req.flash();
    var feedback = ''
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - Create';
    var list = template.list(req.list);
    var html = template.HTML(title, list, `
          <div style="color:red;">${feedback}</div>
          <form action="/auth/login_process" method="post">
            <p> <input type="text" name="email" placeholder="email"></p>
            <p> <input type="password" name="pwd" placeholder="password"></p>
            <p> <input type="submit" value="login"> </p>
          </form>
        `, '');
    res.send(html);
  })

  //로그인 성공/실패후 처리
  router.post('/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true

    })
  );

  router.get('/logout', function (req, res) {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  })

  return router;
};