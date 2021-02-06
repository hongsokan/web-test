var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

// main.js 에서는 app 이라는 객체 호출
// 여기서는 router 라는 메소드를 호출

router.get('/create', function (request, response) {
    // fs.readdir('./data', function (error, filelist) {
    var title = 'WEB - create';
    var list = template.list(request.list);
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
      `, '');
    response.send(html);
    // });
  });
  
  router.post('/create_process', function (request, response) {
    // 미들웨어 body-parser 로 라우터 create_process 를 사용하기 간편해짐
    // request 객체의 body 프로퍼티에 접근할 때, 이렇게 코드를 더욱 간결하게 할 수 있음
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      response.redirect(`/topic/${title}`);
    })
    /*
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
      });
    */
  });
  
  router.get('/update/:pageId', function (request, response) {
    // fs.readdir('./data', function (error, filelist) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = request.params.pageId;
      var list = template.list(request.list);
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
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
      );
      response.send(html);
    });
    // });
  });
  
  
  router.post('/update_process', function (request, response) {
    // 역시 body-parser로 간결하게
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.redirect(`/topic/${title}`);
      })
    });
    /*
      var body = '';
      request.on('data', function (data) {
        body = body + data;
      });
      request.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function (error) {
          fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            response.redirect(`/?id=${title}`);
          })
        });
      });
    */
  })
  
  router.post('/delete_process', function (request, response) {
    // body-parser
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function (error) {
      response.redirect('/');
    })
    /*
      var body = '';
      request.on('data', function (data) {
        body = body + data;
      });
      request.on('end', function () {
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function (error) {
          response.redirect('/');
        })
      });
    */
  })
  
  router.get('/:pageId', function (request, response) {
    // fs.readdir('./data', function (error, filelist) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      if(err){  // 에러 처리
        next(err);
      } else {
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags: ['h1']
        });
        var list = template.list(request.list);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/topic/create">create</a>
              <a href="/topic/update/${sanitizedTitle}">update</a>
              <form action="/topic/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`
        );
        response.send(html);
      }
    });
    // });
  });

  module.exports = router;