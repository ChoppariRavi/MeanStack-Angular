import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthService } from "./auth.service";

@Injectable()
export class BlogService {

  domain = this.authService.domain;
  options;

  constructor(
    private http:Http,
    private authService:AuthService
  ) { }

  createAuthenticationHeaders(){
    //this.authToken = this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'content-type':'application/json',
        'authorization': this.authService.authToken
      }),
    });
  }

  savePost(post){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain+"/blog/savepost", post, this.options).map(res=>res.json());
  }

  getAllBlogs(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain+"/blog/getAllBlogs", this.options).map(res=>res.json());
  }

  getSingleBlog(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain+"/blog/getSingleBlog/"+id, this.options).map(res=>res.json());
  }

  updateBlog(blog){
    this.createAuthenticationHeaders();
    return this.http.put(this.domain+'/blog/updateBlog', blog, this.options).map(res=>res.json());
  }

  deleteBlog(id){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain+'/blog/deleteBlog/'+id, this.options).map(res=>res.json());
  }

}
