const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let titleLengthCheck = (title)=>{
  if(!title){
    return false;
  }else{
    if(title.length<5 || title.length>30){
      return false;
    }else{
      return true;
    }
  }
}

let titleValidateCheck = (title)=>{
  if(!title){
    return false;
  }else{
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    return regExp.test(title);
  }
}

let bodyLengthCheck = (body)=>{
  if(!body){
    return false;
  }else {
    if (body.length<5 || body.length>30) {
      return false;
    }else{
      return true;
    }
  }
}

let commentLengthCheck = (comment)=>{
  if(!comment){
    return false;
  }else{
    if(comment.length>200){
      return false;
    }else{
      return true;
    }
  }
}

const titleValidator = [
  {
    validator: titleLengthCheck,
    message: "Title length must be at least 5 characters but no more than 30"
  },
  {
    validator: titleValidateCheck,
    message: 'Title must be aplphbetic or number.'
  }
];

const bodyValidator = [
  {
    validator: bodyLengthCheck,
    message: 'body length must be at least 5 characters but no more than 30'
  }
];

const commentValidator = [
  {
    validator: commentLengthCheck,
    message: 'Comment length must be not more than 200'
  }
];

const blogSchema = new Schema({
  title:{type:String, lowercase:true, validate: titleValidator},
  body:{type:String, lowercase:true, validate: bodyValidator},
  createdby:{type:String},
  createdat:{type:Date, default: Date.now()},
  likes:{type: Number, default:0},
  likedby:{type:Array},
  dislikes:{type: Number, default:0 },
  dislikedby:{type:Array},
  comments:[{
    comment:{type:String, validate:commentValidator},
    commentedby:{type:String}
  }]
});


module.exports = mongoose.model('blog', blogSchema);
