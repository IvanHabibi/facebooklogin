var User = require('../models/user');
const jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');
var util = {};
require('dotenv').config();

util.passportFacebook = function(token, refreshToken, profile, done, next){
  process.nextTick(function() {
    console.log('===========================================');
    User.findOne({ 'account.id': profile.id }, function(err, user) {
      console.log('===========================================');
      if (err)
        return next(err);
        console.log('===========================================');
      if (user) {
        console.log('===========================================');
        return next(null, user);
      } else {

        var user = new User();
        user.name = profile.name.givenName + ' ' + profile.name.familyName;
        user.username = profile.name.givenName;
        user.account.kind = 'facebook'
        user.account.id = profile.id;
        user.account.token = token;
        user.account.email = (profile.emails[0].value || '').toLowerCase();

        user.save(function(err) {
          if (err)
            throw err;
        return  next(null, user);
        });
      }
    });
  });
}

util.passportAuth = function(username, password, next) {
    User.findOne({
        username: username
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (user == null) {
            return next(null, {
                msg: 'username not match anyone'
            });
        }

        if (!passwordHash.verify(password, user.account.password)) {
            return next(null, {
                msg: 'password not match with username'
            });
        }
        return next(null, user);
    });
}

util.isValidUser = function(req, res, next) {
    jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {

        if (decoded) {

            if (decoded.key === process.env.USER_VALIDATION) {
                req.username = decoded.username;
                next();
            } else {
                res.send('invalid user');
            }
        } else {
            res.send(err)
        }
    })
}



util.isValidAdmin = function(req, res, next) {

    jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {

        if (decoded) {

            if (decoded.role === 'admin') {

                next()
            } else {
                res.send('you dont have authorize');
            }
        } else {
            res.send(err)
        }
    })
}

util.isValidUserOrAdmin = function(req, res, next) {
    jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, decoded) => {
        if (decoded) {
            if (decoded.role === 'admin') {
                next()
            } else if (decoded.role === 'user') {
                console.log(decoded.id + ' ' + req.params.id);
                if (decoded.id === req.params.id) {
                    next()
                } else {
                    res.send('your user dont have authorize');
                }
            } else {
                res.send('you dont have authorize');
            }
        } else {
            res.send(err)
        }
    })
}




module.exports = util;
