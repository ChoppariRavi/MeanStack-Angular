import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  processing = false;
  loading = true;
  messageClass;
  message;
  blog;
  currentURL;
  constructor(
    private location:Location,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private blogService:BlogService
  ) { }

  updateBlogSubmit(){
    this.processing = true;
    this.blogService.updateBlog(this.blog).subscribe((data)=>{
      if(!data.success){
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.processing = false;
      }else{
        this.messageClass = "alert alert-success";
        this.message = data.message;
        setTimeout(()=>{
          this.router.navigate(['/blog']);
        },2000);
      }
    });
  }

  ngOnInit() {
    this.currentURL = this.activatedRoute.snapshot.params;
    //console.log(this.currentURL.id);
    this.blogService.getSingleBlog(this.currentURL.id).subscribe((data)=>{
      //console.log(data.blog);
      if(!data.success){
        this.message = data.message;
        this.messageClass = "alert alert-danger";
      }else{
        this.blog = data.blog;
        this.loading = false;
      }

    });
  }

}
