var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var memberSchema = new Schema({
  fb: {
    id: String,
    token: String
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  status: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: 'Member'
  },
  resetPwdToken: String,
  resetPwdExpires: Date
})

memberSchema.methods.genHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

memberSchema.methods.validatePass = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Member', memberSchema);
