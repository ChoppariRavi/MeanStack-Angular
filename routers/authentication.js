const User = require('../models/user'); // import model Scheme
const jwt = require('jsonwebtoken');
const config = require('../config/database');

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
               res.json({success:true, message:'User registration successfully Completed!'});
             }
           });
         }
       }
     }
  });
  router.get('/checkEmail/:email', (req, res)=>{
    //res.send('tets');
    if(!req.params.email){
      res.json({ success: false, message: 'Please provide Email-Id.' });
    }else{
      User.findOne({email:req.params.email},(err, user)=>{
        if(err){
          res.json({ success: false, message: err });
        }else{
          if(user){
            res.json({ success: false, message: 'E-mail already taken' });
          }else{
            res.json({ success: true, message: 'E-mail is available.' });
          }
        }
      });
    }
  });
  router.get('/checkUserName/:username', (req, res)=>{
    if(!req.params.username){
      res.json({ success: false, message: 'Please provide username.' });
    }else{
      User.findOne({username: req.params.username}, (err, user)=>{
        if(err){
          res.json({ success: false, message: err });
        }else{
          if(user){
            res.json({success: false, message: 'Usernam already taken.' });
          }else{
            res.json({success: true, message: 'Username is available'});
          }
        }
      });
    }
  });
  router.post('/login', (req, res)=>{
    //res.send("test");
    if(!req.body.username){
      res.json({success:false, message: 'Username isnot provided.'});
    }else{
      if(!req.body.password){
        res.json({success:false, message: 'password isnot provided.'});
      }else{
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user)=>{
            if(err){
              res.json({success:false, message: err});
            }else{
              if(!user){
                res.json({success:false, message: 'User not found!'});
              }else{
                const validPassword = user.comparePassword(req.body.password);
                if(!validPassword){
                  res.json({success:false, message: 'Password is not valid.'});
                }else{
                  const token = jwt.sign({ userId:user._id }, config.secret, { expiresIn:'24h' });
                  res.json({success: true, message:'Success!', token: token, user:{username:user.username}});
                }
              }
            }
        });
      }
    }
  });
  router.use((req, res, next)=>{
    //console.log(req.headers['authorization']);
    let token = req.headers['authorization'];
    if(!token){
      res.json({ success: false, message: "Please provide token." })
    }else{
      jwt.verify(token, config.secret, (err, decoded)=>{
          if(err){
            res.json({ success: false, message: 'Token Invalid:'+err });
          }else{
            req.decoded = decoded;
            next();
          }
      });
    }
  });
  router.get('/profile', (req, res)=>{
    //res.json({ success: false, message: req.decoded });
    User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user)=>{
      if(err){
        res.json({ success: false, message: err });
      }else{
        if(!user){
          res.json({ success: false, message: 'User not found!' });
        }else{
          res.json({ success: true, user: user });
        }
      }
    });
  });

  return router;
}
