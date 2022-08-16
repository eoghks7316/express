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
        res.redirect(`/`)
    } else {
        res.send("Who?")
    }

})

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect(`/`)
    });
})

/*********** Create ************/

// router.get('/create', function (req, res) {
//     var title = 'WEB - Create';
//     var list = template.list(req.list);
//     var html = template.HTML(title, list, `
//         <form action="/topic/create_process" method="post">
//           <p><input type="text" name="title" placeholder="title"></p>
//           <p>
//             <textarea name="description" placeholder="description"></textarea>
//           </p>
//           <p>
//             <input type="submit">
//           </p>
//         </form>
//       `, '');
//     res.send(html);
// })

// router.post('/create_process', function (req, res) {
//     fs.writeFile(`data/${req.body.title}`, req.body.description, 'utf8', function (err) {
//         res.redirect(`/topic/${req.body.title}`)
//     })
// })

// /*********** Delete ************/
// router.post('/delete_process', function (req, res) {
//     fs.unlink(`data/${req.body.id}`, function (error) {
//         res.redirect('/')
//     })

// })

// /*********** Update ************/
// router.get('/update/:pageId', function (req, res) {
//     var filteredId = path.parse(req.params.pageId).base;
//     fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
//         var title = req.params.pageId;
//         var list = template.list(req.list);
//         var html = template.HTML(title, list,
//             `
//            <form action="/topic/update_process" method="post">
//              <input type="hidden" name="id" value="${title}">
//              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//              <p>
//                <textarea name="description" placeholder="description">${description}</textarea>
//              </p>
//              <p>
//                <input type="submit">
//              </p>
//            </form>
//            `,
//             ``
//         );
//         res.send(html)
//     });
// })

// router.post('/update_process', function (req, res) {
//     fs.rename(`data/${req.body.id}`, `data/${req.body.title}`, function (error) {
//         fs.writeFile(`data/${req.body.title}`, req.body.description, 'utf8', function (err) {
//             res.redirect(`/topic/${req.body.title}`)
//         })
//     });
// })

// /*********** Read ************/

// router.get('/:pageId', function (req, res, next) {
//     var filteredId = path.parse(req.params.pageId).base;
//     fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
//         if (err) {
//             next(err);
//         } else {
//             var title = req.params.pageId
//             var sanitizedTitle = sanitizeHtml(title);
//             var sanitizedDescription = sanitizeHtml(description, {
//                 allowedTags: ['h1']
//             });
//             var list = template.list(req.list);
//             var html = template.HTML(sanitizedTitle, list,
//                 `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
//                 ` <a href="/topic/create">create</a>
//             <a href="/topic/update/${sanitizedTitle}">update</a>
//             <form action="/topic/delete_process" method="post">
//               <input type="hidden" name="id" value="${sanitizedTitle}">
//               <input type="submit" value="delete">
//             </form>`
//             );
//             res.send(html);
//         }
//     });
// })

module.exports = router;