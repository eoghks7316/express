var express = require('express')
var fs = require('fs');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var bodyParser = require('body-parser');

const app = express()
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('*', function (req, res, next) {
  fs.readdir('./data', function (error, filelist) {
    req.list = filelist;
    next();
  });
})

//route = path마다 정당한 응답
/*********** Read ************/
app.get('/', function (req, res) {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(req.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}
    <img src="images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
    `,
    `<a href="/create">create</a>`
  );
  res.send(html);
})

app.get('/page/:pageId', function (req, res, next) {
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
        ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      res.send(html);
    }
  });
})

/*********** Create ************/
app.get('/create', function (req, res) {
  var title = 'WEB - Create';
  var list = template.list(req.list);
  var html = template.HTML(title, list, `
      <form action="/create" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
  res.send(html);
})

app.post('/create', function (req, res) {
  fs.writeFile(`data/${req.body.title}`, req.body.description, 'utf8', function (err) {
    res.redirect(`/page/${req.body.title}`)
  })
})

/*********** Update ************/
app.get('/update/:pageId', function (req, res) {
  var filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    var title = req.params.pageId;
    var list = template.list(req.list);
    var html = template.HTML(title, list,
      `
         <form action="/update" method="post">
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
      `<a href="/create">create</a> <a href="/update/${title}">update</a>`
    );
    res.send(html)
  });
})

app.post('/update', function (req, res) {
  fs.rename(`data/${req.body.id}`, `data/${req.body.title}`, function (error) {
    fs.writeFile(`data/${req.body.title}`, req.body.description, 'utf8', function (err) {
      res.redirect(`/page/${req.body.title}`)
    })
  });
})

/*********** Delete ************/
app.post('/delete', function (req, res) {
  fs.unlink(`data/${req.body.id}`, function (error) {
    res.redirect('/')
  })

})

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

/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        
      } else {
        
      }
    } else if(pathname === '/create'){
      
    } else if(pathname === '/create_process'){
      
      });
    } else if(pathname === '/update'){
  
    } else if(pathname === '/update_process'){
      
    } else if(pathname === '/delete_process'){
      
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/