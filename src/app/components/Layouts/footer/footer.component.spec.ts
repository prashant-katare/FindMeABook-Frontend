import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render company name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.footer-section h3')?.textContent).toContain('FindMeABook');
  });

  it('should render quick links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.footer-section ul li');
    expect(links.length).toBe(4);
    
    const expectedLinks = ['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'];
    links.forEach((link, index) => {
      expect(link.textContent).toContain(expectedLinks[index]);
    });
  });

  it('should render social media links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const socialLinks = compiled.querySelectorAll('.social-links a');
    expect(socialLinks.length).toBe(3);
    
    const expectedPlatforms = ['Facebook', 'Twitter', 'Instagram'];
    socialLinks.forEach((link, index) => {
      expect(link.textContent).toContain(expectedPlatforms[index]);
    });
  });

  it('should display current year in copyright notice', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const currentYear = new Date().getFullYear();
    expect(compiled.querySelector('.footer-bottom')?.textContent)
      .toContain(`© ${currentYear} FindMeABook`);
  });
}); 