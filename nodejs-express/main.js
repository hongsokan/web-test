var express = require('express');
var app = express();
var port = 3000;
var fs = require('fs');
// var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
// 보안 이슈 해결 위한 라우터
var helmet = require('helmet');
app.use(helmet());

// 정적인 파일의 서비스
app.use(express.static('public'))

// 미들웨어 body-parser 사용법
// create_process, update_process, delete_process
// body 생성하고, request 콜백? 
// 프로세스 간결하게 해준다
app.use(bodyParser.urlencoded({ extended: false }))

// 미들웨어 compression, zip 파일로 압축해서 데이터 전송
// 웹 브라우저는 압축된 방식으로 다시 풀어서 사용하게 된다
app.use(compression({ filter: shouldCompress }))

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

// 미들웨어 만들기
// app.use 는 get 과 post 모두에 해당 미들웨어 적용
// 여기선 app.get 으로 get 에서만 filelist 불러오는 것이 더욱 효율적
// app.use(function (request, response, next) {
app.get('*', function(request, response, next) {
  // 각 라우터에 공통적으로 들어가는 로직, 미들웨어로 간편하게 만들어준다
  // 여기선 글 목록을 표현해주는 기능
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next(); // 그 다음에 호출될 미들웨어 실행
  });
})

app.use('/', indexRouter);
app.use('/topic', topicRouter);


// 404 에러 처리
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

// 오류 핸들러
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


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

    } else if(pathname === '/create'){

    } else if(pathname === '/create_process'){

    } else if(pathname === '/update'){

    } else if(pathname === '/update_process'){

    } else if(pathname === '/delete_process'){

app.listen(3000);
*/
