import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Address, AuthService, UserProfile } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    this.name = this.authService.getUsername() || 'Guest';
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

    if(this.authService.isLoggedIn() && this.authService.hasUserRole()) {

    this.addressLoading = true;
      if (localStorage.getItem('address')) {
        this.address = JSON.parse(localStorage.getItem('address') || '{}');
        this.addressLoading = false;
      } else {
      this.authService.getUserAddress(username).subscribe({
        next: (data) => {
          this.address = data;
          this.addressLoading = false;
          //save address to local storage
          localStorage.setItem('address', JSON.stringify(this.address));
        },
        error: (err) => {
        this.error = 'Failed to load address: ' + err.message;
        this.addressLoading = false;
        }
      });
    }
  }
  }
  
} 