var express = require('express')
var router = express.Router()

var path = require('path');
var template = require('../lib/template.js');
var fs = require('fs');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var auth = require('../lib/auth.js');
/*********** Create ************/

router.get('/create', function (req, res) {
    var title = 'WEB - Create';
    var list = template.list(req.list);
    var html = template.HTML(title, list, `
        <form action="/topic/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '', auth.StatusUI(req, res));
    res.send(html);
})

router.post('/create_process', function (req, res) {
    fs.writeFile(`data/${req.body.title}`, req.body.description, 'utf8', function (err) {
        res.redirect(`/topic/${req.body.title}`)
    })
})

/*********** Delete ************/
router.post('/delete_process', function (req, res) {
    fs.unlink(`data/${req.body.id}`, function (error) {
        res.redirect('/')
    })

})

/*********** Update ************/
router.get('/update/:pageId', function (req, res) {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = req.params.pageId;
        var list = template.list(req.list);
        var html = template.HTML(title, list,
            `
           <form action="/topic/update_process" method="post">
             <input type="hidden" name="id" value="${title}">
             <p><input type="text" name="title" placeholder="title" value="${title}"></p>
             <p>
               <textarea name="description" placeholder="description">${description}</textarea>
             </p>
             <p>
               <input type="submit">
             </p>
           </form>
           `,
            ``,
            auth.StatusUI(req, res)
        );
        res.send(html)
    });
})

router.post('/update_process', function (req, res) {
    fs.rename(`data/${req.body.id}`, `data/${req.body.title}`, function (error) {
        fs.writeFile(`data/${req.body.title}`, req.body.description, 'utf8', function (err) {
            res.redirect(`/topic/${req.body.title}`)
        })
    });
})

/*********** Read ************/

router.get('/:pageId', function (req, res, next) {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        if (err) {
            next(err);
        } else {
            var title = req.params.pageId
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags: ['h1']
            });
            var list = template.list(req.list);
            var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`,
                auth.StatusUI(req, res)
            );
            res.send(html);
        }
    });
})

module.exports = router;