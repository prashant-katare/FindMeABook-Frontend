import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangePasswordComponent } from './change-password.component';
import { AuthService } from '../../../core/services/auth.service';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['changePassword']);

    await TestBed.configureTestingModule({
      imports: [
        ChangePasswordComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.changePasswordForm.get('currentPassword')?.value).toBe('');
    expect(component.changePasswordForm.get('newPassword')?.value).toBe('');
    expect(component.changePasswordForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.changePasswordForm;
    expect(form.valid).toBeFalsy();

    form.controls['currentPassword'].setValue('password123');
    form.controls['newPassword'].setValue('newpassword123');
    form.controls['confirmPassword'].setValue('newpassword123');

    expect(form.valid).toBeTruthy();
  });

  it('should validate password length', () => {
    const newPasswordControl = component.changePasswordForm.controls['newPassword'];
    
    newPasswordControl.setValue('short');
    expect(newPasswordControl.errors?.['minlength']).toBeTruthy();

    newPasswordControl.setValue('validpassword123');
    expect(newPasswordControl.errors?.['minlength']).toBeFalsy();
  });

  it('should validate password match', () => {
    const form = component.changePasswordForm;
    
    form.controls['newPassword'].setValue('password123');
    form.controls['confirmPassword'].setValue('different123');
    
    component.onSubmit();
    expect(component.formValid).toBeFalsy();

    form.controls['confirmPassword'].setValue('password123');
    component.onSubmit();
    expect(component.formValid).toBeTruthy();
  });

  it('should render validation messages', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const form = component.changePasswordForm;

    // Touch all fields to trigger validation messages
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
    });
    fixture.detectChanges();

    const errorMessages = compiled.querySelectorAll('.error-message');
    expect(errorMessages.length).toBeGreaterThan(0);
  });
}); 