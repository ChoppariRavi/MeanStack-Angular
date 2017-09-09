const User = require('../models/user'); // import model Scheme

module.exports = (router) => {
  router.post('/register', (req, res)=>{
    // req.body.email
     if(!req.body.email){
       res.json({success:false, message: 'you must provide emailId.'});
     }else {
       if(!req.body.username){
         res.json({success:false, message: 'you must provide username.'});
       }else {
         if(!req.body.password){
           res.json({success:false, message: 'you must provide password.'});
         }else{
           let user = new User({
             email: req.body.email.toLowerCase(),
             username: req.body.username.toLowerCase(),
             password: req.body.password
           });
           user.save((err)=>{
             if(err){
               console.log(err);
               //res.json({sucess:false, message:'Could not save user. Error: ', err});
               if(err.errors.email){
                 res.json({ success: false, message: err.errors.email.message });
               }else{
                 if(err.errors.username){
                   res.json({ success: false, message: err.errors.username.message });
                 }else{
                   if(err.errors.password){
                     res.json({ success: false, message: err.errors.password.message });
                   }else{
                     res.json({sucess:false, message:'Could not save user. Error: ', err});
                   }
                 }
               }
             }else{
               res.json({success:true, mssage:'User registration successfully Completed!'});
             }
           });
         }
       }
     }
  });
  return router;
}
