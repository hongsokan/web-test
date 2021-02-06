// http cookie
// how to get cookie in nodejs

var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response){
    console.log(request.headers.cookie);
    var cookies = {};
    if(request.headers.cookie !== undefined) {
        var cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies.yummy_cookie);
    // Cookie 생성
    response.writeHead(200, {
        'Set-Cookie': [
            `yummy_cookie=choco`, 
            `tasty_cookie=strawberry`,
            `Permanent=cookies; Max-Age=${60*60*24*30}`,    // 영구적 쿠키, 만료 기간 설정까지
            // 아래는 javascript 를 통한 하이재킹을 피하는 두 가지 보안 방법
            `Secure=Secure; Secure`,    // https
            `HttpOnly=HttpOnly; HttpOnly`,   // 웹브라우저와 웹서버가 통신할 때만 쿠키
            `Path=Path; Path=/cookie`,   // 해당 디렉토리 안에서만 쿠키가 살아 있게 된다
            `Domain=Domain; Domain=o2.org`  // 어떤 도메인에서만 쿠키를 살릴지 정할 수 있음
        ]
    })
    response.end('Cookie!!');
}).listen(3000);