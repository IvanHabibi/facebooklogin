var method = {}
var Todo = require("../models/todo");
var User = require("../models/user");
require('dotenv').config();


method.getAllTaskbyUser = (req, res) => {

    User.local.findOne({
        username: req.username
    }, function(err, user) {
        if (err) {
            res.send(err)
        }
    }).populate('todolist').exec((err, result) => {
        if (result) {
            res.send(result.todolist)
        } else {
            res.send(`ERR getall :\n ${err}`)
        }
    })
}



method.insertTaskToUser = (req, res) => {

    var todo = new Todo({
        task: req.body.task,
        status: false,
        createdAt: req.body.date || new Date().toISOString()
    });
    todo.save(function(err, todo) {
        if (err) {
            res.send(err);
        }
        User.findOne({
            username: req.username
        }, function(err, user) {
            if (err) {
                res.send(err)
            } else {
                if (user.todolist == undefined) {
                    user.todolist = todo.id
                } else {
                    user.todolist.push(todo.id)
                }
                user.save(function(err, user) {
                    if (err) {
                        res.send(err)
                    }
                    res.send(user);
                });

            }
        })
    });
}

method.statusTask = (req, res) => {
        Todo.findById(req.params.id, function(err, todo) {

                if (err) {
                    res.send(err);
                } else {
                  console.log(todo);
                    if (todo.status === false) {
                        todo.status = true
                    } else {
                        todo.status = false
                    }
                    todo.save(function(err, todo) {
                        if (err) {
                            res.send(err)
                        }

                        res.send(todo);
                    });
                }
            })
        }

        method.updateTask = (req, res) => {
                Todo.findById(req.params.id, function(err, todo) {

                        if (err) {
                            res.send(err);
                        } else {
                          todo.task = req.body.task || todo.task
                            todo.save(function(err, todo) {
                                if (err) {
                                    res.send(err)
                                }

                                res.send(todo);
                            });
                        }
                    })
                }

                method.deleteTask = (req, res) => {
                    Todo.findByIdAndRemove(req.params.id, function(err, user) {
                        var response = {
                            message: "todo successfully deleted",
                            id: user._id
                        };
                        res.send(response);
                    });
                }







        module.exports = method;
