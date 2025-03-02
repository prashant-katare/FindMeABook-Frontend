import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Address } from '../../../core/models/address.model';
import { UserProfile } from '../../../core/models/user.model';
import { AddressService } from '../../../core/services/address.service';
import { UserService } from '../../../core/services/user.service';
import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  name: string = '';
  profile: UserProfile | null = null;
  error: string = '';
  address: Address | null = null;
  addressLoading: boolean = false;
  addressForm: FormGroup;

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private addressService: AddressService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.addressForm = this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: [''],
      phoneNumber: ['']
    });
  }

  async ngOnInit() {
    this.name = this.storageService.getUsernameFromToken() || 'Guest';
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

    if(this.authService.isLoggedIn() && this.authService.hasUserRole()) {
      
    this.addressLoading = true;

      this.addressService.getUserAddress(userId).subscribe({
        next: (data) => {
          this.address = data;
          this.addressLoading = false;
          //save address to local storage

          console.log('Address loaded from server and saved to local storage');
        },
        error: (err) => {
        this.error = 'Failed to load address: ' + err.message;
        this.addressLoading = false;
        }
      });
    }
  }
  
} 