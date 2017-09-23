import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

   domain = "http://localhost:3030"; // Development Domain - Not Needed in Production
   user;
   authToken;
   options;

  constructor(private http:Http) { }

  createAuthenticationHeaders(){
    this.loadToken();
    //console.log(this.authToken);
    this.options = new RequestOptions({
      headers: new Headers({
        "Content-Type":"application/json",
        "authorization":this.authToken
      })
    });
  }

  loadToken(){
    this.authToken = localStorage.getItem("token");
  }

  registerUser(user){
    console.log(user);
    return this.http.post(this.domain+'/authentication/register', user).map(res=>res.json());
  }

  checkEmail(email){
    return this.http.get(this.domain+'/authentication/checkEmail/'+email).map(res=>res.json());
  }

  checkUsername(username){
    return this.http.get(this.domain+'/authentication/checkUsername/'+username).map(res=>res.json());
  }

  userLogin(user){
    return this.http.post(this.domain+'/authentication/login', user).map(res=>res.json());
  }

  getUserProfile(){
    this.createAuthenticationHeaders();
    //console.log(this.options);
    return this.http.get(this.domain+'/authentication/profile', this.options).map(res=>res.json());
  }

  storeUserData(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logIn(){
    return tokenNotExpired();
  }

  logOut(){
    this.user = null;
    this.authToken = null;
    localStorage.clear(); // clear storage....
  }

}
