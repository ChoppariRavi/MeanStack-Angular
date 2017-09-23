import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { BlogComponent } from './blog/blog.component';
import { EditBlogComponent } from './blog/edit-blog/edit-blog.component';

import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
      path: 'dashboard',
      component: DashboardComponent, // The Dashboard Route
      canActivate: [AuthGuard] // User must NOT be logged in to view this route
  },
  {
      path: 'profile',
      component: ProfileComponent,
      canActivate:[AuthGuard]
  },
  {
      path: 'blog',
      component: BlogComponent,
      canActivate: [AuthGuard]
  },
  {
    path: 'edit-blog/:id',
    component: EditBlogComponent,
    canActivate:[AuthGuard]
  },
  {
      path: 'register',
      component: RegisterComponent, // The Register Route
      canActivate: [NotAuthGuard] // User must NOT be logged in to view this route
    },
  {
      path: 'login',
      component: LoginComponent, // The Login Route
      canActivate: [NotAuthGuard] // User must NOT be logged in to view this route
  },
  { path: '**', component: HomeComponent }
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports:[RouterModule]
})
export class AppRoutingModule { }
