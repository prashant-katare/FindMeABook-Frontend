import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Address, AuthService, UserProfile } from '../../services/auth.service';

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
    private router: Router
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
    const username = this.authService.getUsername();
    if (!username) {
      this.error = 'Not authenticated';
      return;
    }

    this.authService.getUserProfile(username).subscribe({
      next: (data) => {
        this.profile = data;
        console.log(this.profile);
        this.populateProfileData();
      },
      error: (err) => {
        this.error = 'Failed to load profile: ' + err.message;
      }
    });
  }

  private loadUserAddress() {
    const username = this.authService.getUsername();
    if (!username) {
      this.error = 'Not authenticated';
      return;
    }

    this.addressLoading = true;
    this.authService.getUserAddress(username).subscribe({
      next: (data) => {
        this.address = data;
        this.addressLoading = false;
        console.log(this.address);
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
      if (this.address.phoneNumber && this.address.phoneNumber !== '0000000000') {
        this.updateForm.patchValue({
          phoneNumber: this.address.phoneNumber
        });
      }

      if (this.address.country) {
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
      this.loading = true;
      
      const username = this.authService.getUsername() || '';
      
      // Separate user profile data from address data
      const profileData = {
        fullName: this.updateForm.get('fullName')?.value,
        email: this.updateForm.get('email')?.value,
      };

      console.log(profileData);
      
      const addressData: Address = {
        phoneNumber: this.updateForm.get('phoneNumber')?.value,
        ...this.updateForm.get('address')?.value
      };
      
      // First update the user profile
      this.authService.updateUserInfo(username, profileData).subscribe({
        next: () => {
          // After profile is updated, update the address
          this.authService.saveOrUpdateAddress(username, addressData).subscribe({
            next: () => {
              this.loading = false;

              //save address to local storage
              localStorage.setItem('address', JSON.stringify(addressData));
              
              alert('Profile updated successfully!');
              this.router.navigate(['/profile']);
            },
            error: (error) => {
              this.loading = false;
              this.formValid = false;
              console.error('Address update failed:', error);
            }
          });
        },
        error: (error) => {
          this.loading = false;
          this.formValid = false;
          console.error('Profile update failed:', error);
        }
      });
    } else {
      this.formValid = false;
    }
  }

  onStateChange(): void {
    // This method is called when the state dropdown changes
    // You can add additional logic here if needed
  } 

} 