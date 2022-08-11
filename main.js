var express = require('express')
var fs = require('fs');

var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');


const app = express()
/*********** Static File ************/
app.use(express.static('public'));

/*********** Middle ware ************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
