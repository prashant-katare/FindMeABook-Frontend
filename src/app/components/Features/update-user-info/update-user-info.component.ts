import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Address } from '../../../core/models/address.model';
import { UserProfile } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { AddressService } from '../../../core/services/address.service';
import { StorageService } from '../../../core/services/storage.service';
@Component({
  selector: 'app-update-user-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-user-info.component.html',
  styleUrls: ['./update-user-info.component.css']
})
export class UpdateUserInfoComponent implements OnInit {
  updateForm: FormGroup;
  loading = false;
  formValid = true;
  address: Address | null = null;
  profile: UserProfile | null = null;
  error: string = '';
  addressLoading: boolean = false;
  
  states: string[] = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];
  
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private addressService: AddressService,
    private storageService: StorageService
  ) {
    this.updateForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$|^\d{3}-\d{3}-\d{4}$/)]],
      address: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(9), Validators.pattern(/^[0-9\s-]+$/)]],
        country: ['', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z\s-]+$/) // Only letters, spaces, and hyphens
        ]]
      })
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserAddress();
  }

  private loadUserProfile() {
    const userId = this.storageService.getUserIdFromToken();
    if (!userId) {
      this.error = 'Not authenticated';
      return;
    }

    this.addressService.getUserProfile(userId).subscribe({
      next: (data) => {
        this.profile = data;
        
        this.populateProfileData();
      },
      error: (err) => {
        this.error = 'Failed to load profile: ' + err.message;
      }
    });
  }

  private loadUserAddress() {
    const userId = this.storageService.getUserIdFromToken();
    if (!userId) {
      this.error = 'Not authenticated';
      return;
    }

    this.addressLoading = true;
      this.addressService.getUserAddress(userId).subscribe({
      next: (data) => {
        this.address = data;
        this.addressLoading = false;
        
        this.populateAddressData();
      },
      error: (err) => {
        this.error = 'Failed to load address: ' + err.message;
        this.addressLoading = false;
      }
    });
  }

  private populateProfileData(): void {
    if (this.profile) {
      this.updateForm.patchValue({
        fullName: this.profile.fullName || '',
        email: this.profile.email || ''
      });
    }
  }

  private populateAddressData(): void {
    if (this.address) {
      if (this.address) {
        this.updateForm.patchValue({
          phoneNumber: this.address.phoneNumber
        });
      }

      if (this.address) {
        this.updateForm.get('address')?.patchValue({
            street: this.address.street || '',
            city: this.address.city || '',
            state: this.address.state || '',
            zipCode: this.address.zipCode || '',
            country: this.address.country || ''
          });
      }
    }
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      this.formValid = true;
      this.loading = false;
      
      const userId = this.storageService.getUserIdFromToken();
      
      // Separate user profile data from address data
      const profileData = {
        fullName: this.updateForm.get('fullName')?.value,
        email: this.updateForm.get('email')?.value,
      };

      
      const addressData: Address = {
        phoneNumber: this.updateForm.get('phoneNumber')?.value,
        ...this.updateForm.get('address')?.value
      };

      if(userId) {
        this.addressService.updateUserInfo(userId, profileData).subscribe({
          next: () => {
            console.log('Profile updated successfully');
          },
          error: (error: any) => {
            this.loading = true;
            this.formValid = false;
            console.error('Profile data update failed:', error);
          } 
        });
      } else {
        console.log('No user ID found');
      } 

      if(userId) {  
        this.addressService.saveOrUpdateAddress(userId, addressData).subscribe({
          next: () => {
            localStorage.removeItem('address');
            localStorage.setItem('address', JSON.stringify(addressData));
            console.log('Address updated successfully');
          },
          error: (error: any) => {
            this.loading = true;
            this.formValid = false; 
            console.error('Address update failed:', error);
          } 
        });
      } else {
        console.log('No user ID found');
      } 

      this.router.navigate(['/profile']);
    } else {
      this.formValid = false;
      this.loading = true;
    }
  }


  onStateChange(): void {
    // This method is called when the state dropdown changes
    // You can add additional logic here if needed
  } 
} 