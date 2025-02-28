import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink } from '@angular/router';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, RouterLink]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display profile sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('.profile-section');
    expect(sections.length).toBe(4);
  });

  it('should have login button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginButton = compiled.querySelector('.btn-primary');
    expect(loginButton?.textContent).toContain('Log In');
  });

  it('should have correct section headings', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = compiled.querySelectorAll('h2');
    const expectedHeadings = [
      'Personal Information',
      'Reading Preferences',
      'Reading History',
      'Account Settings'
    ];
    
    headings.forEach((heading, index) => {
      expect(heading.textContent).toContain(expectedHeadings[index]);
    });
  });
}); 