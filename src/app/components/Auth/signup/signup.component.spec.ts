import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink } from '@angular/router';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent, RouterLink]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all required form fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[type="text"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="password"]')).toBeTruthy();
    expect(compiled.querySelector('#confirm-password')).toBeTruthy();
  });

  it('should have genre preferences section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const genreSection = compiled.querySelector('.preferences');
    expect(genreSection).toBeTruthy();
    const checkboxes = compiled.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(5);
  });

  it('should have login link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginLink = compiled.querySelector('.login-link a');
    expect(loginLink?.textContent).toContain('Log in');
    expect(loginLink?.getAttribute('routerLink')).toBe('/login');
  });
}); 