const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const uniqueValidator = require('mongoose-unique-validator');

let emailLengthValidate =   (email) => {
  if(!email){
    return false;
  }else{
    if(email.length<5 || email.legth>30){
      return false;
    }else{
      return true;
    }
  }
}

let validEmailChecker = (email) => {
  if(!email){
    return false;
  }else{
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }
}

const emailValidator = [
  {
    validator: emailLengthValidate,
    message: 'E-mail must be at least 5 characters but no more than 30'
  },
  {
    validator: validEmailChecker,
    message: 'Must be valid email-id'
  }
];

let usernameLengthValidate = (username) => {
  if(!username){
    return false;
  }else{
    if(username.length<3 || username.legth>15){
      return false;
    }else{
      return true;
    }
  }
}

let validateusername = (username) => {
  if(!username){
    return false;
  }else{
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username);
  }
}

const usernameValidator = [
  {
    validator: usernameLengthValidate,
    message: 'Username must be at least 3 characters but no more than 15'
  },
  {
    validator: validateusername,
    message: 'Username must not have any special characters'
  }
];

let passwordLengthValidate = (password) => {
  if(!password){
    return false;
  }else{
    if(password.length<3 || password.legth>15){
      return false;
    }else{
      return true;
    }
  }
}

let validatePassWord = (password) => {
  if(!password){
    return false;
  }else{
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password);
  }
}

const passwordValidator = [
  {
    validator: passwordLengthValidate,
    message: 'Password must be at least 8 characters but no more than 35'
  },
  {
    validator: validatePassWord,
    message: 'Password Must have at least one uppercase, lowercase, special character, and number'
  }
];

// User Model Definition
const userSchema = new Schema({
  email: { type: String, required: true, index: true, unique: true, lowercase: true, validate: emailValidator },
  username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidator },
  password: { type: String, required: true, validate: passwordValidator }
});
// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);

userSchema.pre('save', function(next){
  if(!this.isModified('password')){
    return next();
  }
  bcrypt.hash(this.password, null, null, (err, hash)=>{
    if(err) return next(err);
    this.password = hash;
    next();
  });

});

userSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('user', userSchema);
