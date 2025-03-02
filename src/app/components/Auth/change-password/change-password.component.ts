import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../../../core/services/address.service';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';

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
    private addressService: AddressService,
    private adminService: AdminService,
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

      if(this.authService.hasUserRole()){
      
        this.addressService.changePassword(passwords).subscribe({
          next: () => {
            alert('Password changed successfully');
            this.router.navigate(['/profile']);
          },
          error: (error: any) => {
            this.formValid = false;
            console.error('Password change failed:', error);
          }
        });

      }
      else if(this.authService.hasAdminRole()){

        this.adminService.changePassword(passwords).subscribe({
          next: () => {
            alert('Password changed successfully');
            this.router.navigate(['/admin']);
          },
          error: (error: any) => {
            this.formValid = false;
            console.error('Password change failed:', error);
          } 
        });
      }

    }
    else {
      this.formValid = false;
    }
  }
} 