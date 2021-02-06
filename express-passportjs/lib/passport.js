module.exports = function (app) {

    var authData = {
        email: 'email',
        password: 'pw',
        nickname: 'user1'
    }

    // passport 설치
    var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

    // passport.session 사용
    app.use(passport.initialize());
    app.use(passport.session());

    // 사용자가 로그인 성공했을 때, 딱 한번 호출, session store에 값 저장
    passport.serializeUser(function (user, done) {
        // console.log('serializeUser', user);
        done(null, user.email); // 식별자, 값은 session 내부로 전달
    });

    // serializeUser 에서 session store에 저장된 데이터에서 실제 필요한 데이터 조회
    passport.deserializeUser(function (id, done) {
        // console.log('deserializeUser', id);
        done(null, authData); // 실제 사용자
    });

    // 사용자가 로그인 시도했을 때, 성공했는지 실패했는지 여부
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd',
        },
        function (username, password, done) {
            // console.log('LocalStrategy', username, password);
            if (username === authData.email) {
                console.log(1); // 확인 용, usr O
                if (password === authData.password) {
                    console.log(2); // 확인 용, usr O & pwd O
                    return done(null, authData);
                } else {
                    console.log(3); // 확인 용, usr O & pwd X
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            } else {
                console.log(4); // 확인 용, usr X
                return done(null.false, {
                    message: 'Incorrect username'
                });
            }
        }
    ));
    return passport;
}