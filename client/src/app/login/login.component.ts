import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form;
  processing = false;
  messageClass;
  message;
  previousUrl;

  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private authGuard:AuthGuard,
    private router:Router,
  ) { this.createForm(); }

  createForm(){
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password:['', Validators.required]
    });
  }

  disableForm(){
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  enableForm(){
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  onLoginSubmit(){
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }
    this.authService.userLogin(user).subscribe(data=>{
      if(!data.success){
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.message; // Set error message
        this.processing = false; // Enable submit button
        this.enableForm(); // Enable form for editting
      }else{
        this.messageClass = 'alert alert-success'; // Set bootstrap success class
        this.message = data.message; // Set success message
        // Function to store user's token in client local storage
        this.authService.storeUserData(data.token, data.user);
        // After 2 seconds, redirect to dashboard page
        setTimeout(() => {
          if(this.previousUrl){
            this.router.navigate([this.previousUrl]);
          }else{
            this.router.navigate(['/dashboard']); // Navigate to dashboard view
          }
        }, 2000);
      }
    });
  }

  ngOnInit() {
    //console.log(this.authGuard.redirectUrl);
    this.previousUrl = this.authGuard.redirectUrl;
  }

}
