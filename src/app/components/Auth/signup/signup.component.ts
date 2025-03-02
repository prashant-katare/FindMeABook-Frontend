import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { SignUpData } from '../../../core/models/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm: FormGroup;
  formValid = true;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.formValid = true;
      const signUpData: SignUpData = {
        fullName: this.signupForm.get('fullName')?.value,
        email: this.signupForm.get('email')?.value,
        password: this.signupForm.get('password')?.value
      };
      
      this.authService.signup(signUpData).subscribe({
        next: (response: string) => {
          console.log('Signup successful:', response);
          alert('Registration successful! Please login with your credentials.');
          this.router.navigate(['/login']);
        },
        error: (error: any ) => {
          console.error('Signup failed:', error);
          this.formValid = false;
          alert('Email already exists. Registration failed. Please try again.');
        }
      });
    } else {
      this.formValid = false;
      console.log('Form is invalid.');
    }
  }
} 