import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  formValid = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const passwords = {
        currentPassword: this.changePasswordForm.get('currentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value
      };

      if (this.changePasswordForm.get('newPassword')?.value !== 
          this.changePasswordForm.get('confirmPassword')?.value) {
        this.formValid = false;
        return;
      }

      this.authService.changePassword(passwords).subscribe({
        next: () => {
          alert('Password changed successfully');
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          this.formValid = false;
          console.error('Password change failed:', error);
        }
      });
    }
    else {
      this.formValid = false;
    }
  }
} 