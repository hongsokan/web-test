const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})


userSchema.pre('save', function (next) {
    // index.js register router로 보내기 전에
    // 비밀번호를 암호화 시킨다. (bcrypt)
    var user = this;

    // 이름이나 이메일 변경하는 경우는 해당되지 않음
    // 비밀번호를 바꾸는 경우에만 비밀번호 암호화 진행
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                return next(err)
            }

            bcrypt.hash(user.password, salt, function (err, hash) {
                // Store hash in your password DB.
                if (err) {
                    return next(err)
                }
                user.password = hash // hash된 비밀번호로 바꿔준다
                next()
            })
        })
    } else {
        next()
    }
})

// 클라이언트에서 요청한 비밀번호와 데이터베이스에 있는 비밀번호 및 암호화된 비밀번호 비교
userSchema.methods.comparePassword = function (plainPassword, cb) {
    // test2
    // plainPassword 1234
    // 암호화된 비밀번호 $2b$10$pPB810c.bYci1BUA6ZyNvuOzdBwph3sslaW32ccJPvq4gPuX3wdqm
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch); // true
    })
}

// 토큰 생성 (jsonwebtoken)
userSchema.methods.generateToken = function (cb) {
    var user = this;

    // jwt 이용해서 토큰 생성, 토큰 = user._id + secretToken
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user 정보가 login router에서 generateToken메서드로 전달됨
    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}


userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    // user._id + '' = token
    // 토큰을 decode 한다
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User', userSchema);

module.exports = { User }