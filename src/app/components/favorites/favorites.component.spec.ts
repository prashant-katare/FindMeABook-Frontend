import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink } from '@angular/router';
import { FavoritesComponent } from './favorites.component';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesComponent, RouterLink]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty favorites message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state p')?.textContent)
      .toContain('You haven\'t added any books to your favorites yet');
  });

  it('should have a browse books link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('.btn-primary');
    expect(link?.textContent).toContain('Browse Books');
    expect(link?.getAttribute('routerLink')).toBe('/');
  });
}); 