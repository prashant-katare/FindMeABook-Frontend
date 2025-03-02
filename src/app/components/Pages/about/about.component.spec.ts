import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('About FindMeABook');
  });

  it('should render all sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('.about-section');
    expect(sections.length).toBe(3);
  });

  it('should render features list', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const features = compiled.querySelectorAll('.about-section ul li');
    expect(features.length).toBe(4);
  });

  it('should have correct section headings', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = compiled.querySelectorAll('h2');
    const expectedHeadings = ['Our Mission', 'How It Works', 'Our Features'];
    
    headings.forEach((heading, index) => {
      expect(heading.textContent).toContain(expectedHeadings[index]);
    });
  });
}); 