var method = {}
var User = require("../models/user");
var passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
require('dotenv').config();

method.getAllUser = (req, res) => {
    User.find(function(err, users) {
        if (err) {
            res.send(err)
        } else {
            res.send(users);
        }
    });
}

method.insertUser = (req, res) => {
  var user = new User();
  user.name = req.body.username;
  user.username = req.body.username;
  user.account.kind = 'local';
  user.account.password = passwordHash.generate(req.body.password);
  user.account.role = req.body.role;

    user.save(function(err, createdUser) {
        if (err) {
            res.send(err);
        }
        res.send(createdUser);
    });
}

method.updateUser = (req, res, next) => {
    User.findById(req.params.id, function(err, user) {
        // Handle any possible database errors
        if (err) {
            res.send(err);
        } else {


            user.username = req.body.username || user.username;
            user.name = req.body.name || user.name;

            if (req.body.password === undefined) {
                user.account.password = user.password;
            } else {
                user.account.password = passwordHash.generate(req.body.password)
            }
            user.account.kind = 'local'
            user.account.role = req.body.role || user.role;


            user.save(function(err, user) {
                if (err) {
                    res.send(err)
                }
                res.send(user);
            });
        }
    });
}

method.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.id, function(err, user) {
        var response = {
            message: "user successfully deleted",
            id: user._id
        };
        res.send(response);
    });
}

method.signUp = (req, res) => {
  var user = new User();
  user.name = req.body.username;
  user.username = req.body.username;
  user.account.kind = 'local';
  user.account.password = passwordHash.generate(req.body.password);
  user.account.role = req.body.role;

    user.save(function(err, createdUser) {
        if (err) {
            res.send(err);
        }
        res.send(createdUser);
    });
}



method.getOneUser = (req, res) => {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            res.send(err)
        }
        res.send(user)
    })
}

method.sendToken = function(req, res) {
  console.log('KIRIM TOKEN');
    var user = req.user
    if (!user.msg) {

        var token = jwt.sign({
            username: user.username,
            name: user.name,
            key: process.env.USER_VALIDATION
        }, process.env.SECRET_KEY, {
            expiresIn: '3h'
        });
        // console.log(token);
        res.send({
            'token': token
        })
    }
    res.send(user.msg)
}






module.exports = method;
