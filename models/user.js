var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

  name: String,
  username: String,
  account:
    {
      kind:String,
      password: String,
      role: String,
      id: String,
      token: String,
      email: String
    },
    todolist: [{
        type: Schema.Types.ObjectId,
        ref: 'todos'
    }]



});

var User = mongoose.model('users', userSchema);

module.exports = User;
