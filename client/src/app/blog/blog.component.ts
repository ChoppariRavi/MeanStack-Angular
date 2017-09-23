import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  newPost = false;
  form;
  processing  = false;
  username;
  message;
  messageClass;
  posts;
  openDeleteModal= false;
  blog;

  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private blogService:BlogService
  ) {
    this.createForm();
  }

  alphaNumericValidation(controls){
    const regExp =  new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    if(regExp.test(controls.value)){
      return null;
    }else{
      return {'alphaNumericValidation':true};
    }
  }

  createForm(){
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ])]
    });
  }

  enableForm(){
    this.form.controls['title'].enable();
    this.form.controls['body'].enable();
  }

  disableForm(){
    this.form.controls['title'].disable();
    this.form.controls['body'].disable();
  }

  saveNewPost(){
    this.disableForm();
    this.processing = true;
    let post = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdby: this.username
    }
    //console.log(JSON.stringify(post));
    this.blogService.savePost(post).subscribe((data)=>{
        //console.log(data);
        if(!data.success){
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
          this.processing = false;
          this.enableForm();
        }else{
          this.messageClass = 'alert alert-success';
          this.message = data.message;
          this.newPost = false;
        }
    });
  }

  backToPosts(){
    window.location.reload();
  }

  newPostForm(){
    this.newPost = true;
  }

  getAllPosts(){
    this.blogService.getAllBlogs().subscribe((data)=>{
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        //this.enableForm();
      }else{
        this.posts = data.blogs;
        //console.log(this.posts);
        /*this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.newPost = false;*/
      }
    });
  }

  openModal(blog){
    //console.log("ok");
    this.openDeleteModal = true;
    this.blog = blog;
    //console.log(this.blog);
  }

  deleteBlog(){
    this.blogService.deleteBlog(this.blog._id).subscribe((data)=>{
      if(!data.success){
        this.messageClass = "alert alert-danger";
        this.message = data.message;
      }else{
        this.messageClass = "alert alert-success";
        this.message = data.message;
        this.getAllPosts();
      }
    });
  }

  ngOnInit() {
    //this.disableForm();
    this.authService.getUserProfile().subscribe((data)=>{
      this.username = data.user.username
      //console.log(data.user.username);
    });
    this.getAllPosts();
  }

}
