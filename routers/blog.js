const Blog = require('../models/blog');
const User = require('../models/user');

module.exports = (router)=>{
  router.post('/savepost', function(req, res){
    if(!req.body.title){
      res.json({ success:false, message: 'You must provide title.' });
    }else {
      if (!req.body.body) {
        res.json({ success: false, message: 'You must provide body.' });
      }else{
        if(!req.body.createdby){
          res.json({ success: false, message: 'You must provide creator.' });
        }else{
          let blog = new Blog({
            title: req.body.title,
            body: req.body.body,
            createdby: req.body.createdby
          });
          blog.save((err)=>{
            if(err){
              //res.json({ success: false, message: err });
              if(err.errors.title){
                res.json({ success: false, message: err.errors.title.message });
              }else{
                if(err.errors.body){
                  res.json({ success: false, message: err.errors.body.message });
                }else{
                  res.json({sucess:false, message:'Could not save user. Error: ', err});
                }
              }
            }else{
              res.json({ success:true, message: "Post saved successfully." });
            }
          });
          //Blog.save();
        }

      }
    }
  });

  router.get('/getAllBlogs', function(req, res){
    Blog.find({}, (err, blogs)=>{
      if(err){
        res.json({ success:false, message: err });
      }else{
        if(!blogs){
          res.json({ success:false, message:'Blogs not found.' });
        }else{
          res.json({ success: true, blogs: blogs });
        }
      }
    }).sort({ '_id':-1 });
  });

  router.get('/getSingleBlog/:id', function(req, res){
      if (!req.params.id) {
        res.json({ success: false, messag: 'No Blog Id was provided.' });
      }else{
        Blog.findOne({_id:req.params.id}, (err, blog)=>{
          if(err){
            res.json({ succss:false, message: "Not a valid blog ID." });
          }else{
            //console.log(req);
            if(!blog){
              res.json({ success:false, message: 'Blog was nt found.' });
            }else{
              console.log(req.decoded.userId);
              User.findOne({_id:req.decoded.userId}, (err, user)=>{
                if(err){
                  res.json({ success: false, message: 'Unable to authenticate user' });
                }else{
                  if(user.username !== blog.createdby){
                    res.json({ success:false, message: "You are not authorized to edit this blog." });
                  }else{
                    res.json({ success:true, blog:blog });
                  }
                }
              });
            }
          }
        })
      }
      //res.json({})
  });

  router.put('/updateBlog', function(req, res){
    //res.send('Hello World!');
    if (!req.body._id) {
      res.json({ success: false, message: "No blog Id provided." });
    }else{
      Blog.findOne({_id:req.body._id}, (err, blog)=>{
        if(err){
          res.json({ success:false, message: "Not a valid blog Id." });
        }else{
          if(!blog){
            res.json({ success:false, message:"Blog Id was not found." });
          }else{
            User.findOne({_id:req.decoded.userId}, (err, user)=>{
              if(err){
                res.json({ success:false, message:err });
              }else{
                if(!user){
                  res.json({ success:false, message: "Unable to authenticate user." });
                }else{
                  if(user.username !== blog.createdby){
                      res.json({ success:false, message: "You are not authrozied to edit this post." });
                  }else{
                      blog.title = req.body.title;
                      blog.body = req.body.body;
                      blog.save((err)=>{
                        if (err) {
                          if(err.errors){
                            res.json({ success:false, message: "Please ensure form filled out properly." });
                          }else{
                            res.json({ success:false, message: err });
                          }
                        }else{
                          res.json({ success:true, message: "Blog Updated!" });
                        }
                      });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.delete('/deleteBlog/:id', function(req, res){
    if(!req.params.id){
      res.json({ success:false, message:"No ID provided." });
    }else{
      Blog.findOne({_id: req.params.id}, (err, blog)=>{
        if(err){
          res.json({ success:false, message: err });
        }else{
          if(!blog){
            res.json({ success:false, message: "Blog was not found." });
          }else{
            User.findOne({_id:req.decoded.userId}, (err, user)=>{
              if(err){
                res.json({ success:false, message: err });
              }else{
                if(!user){
                  res.json({ success:false, message: "Unable to authenticate user." });
                }else{
                  if(user.username !== blog.createdby){
                    res.json({ success:false, message:"You are not authorized to delete this blog post." });
                  }else{
                    blog.remove((err)=>{
                      if(err){
                        res.json({ success:false, message:err });
                      }else{
                        res.json({ success:true, message: "Blog Deleted!" });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  })

  return router;
}
