//session 다음에 passport코드가 등장해야한다.
module.exports = function (app) {

    var authData = {
        email: 'abcde1234@naver.com',
        password: '1111',
        nickname: 'admin'
    }

    var passport = require('passport');
    var LocalStrategy = require('passport-local');
    //local => ID, Password로 로그인

    app.use(passport.initialize());
    app.use(passport.session()); //내부적으로는 세션을 이용

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, {
                email: user.email,
                nickname: user.nickname
            })
        });
    });

    passport.deserializeUser(function (user, cb) {

        process.nextTick(function () {
            return cb(null, authData);
        });
    }); //로그인 성공후

    //로그인 성공/실패 결정
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (username, password, done) {
            if (username === authData.email) {
                if (password === authData.password) {
                    return done(null, authData);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            } else {
                return done(null, false, { message: 'Incorrect username.' });
            }
        }

    ));

    return passport;
}
/*********** Passport ************/



