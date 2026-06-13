import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ThemeService } from '@shared/services/theme.service';

import { AiLabNavbarComponent } from './ai-lab-navbar.component';

describe('AiLabNavbarComponent', () => {
  let fixture: ComponentFixture<AiLabNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLabNavbarComponent],
      providers: [
        provideRouter([]),
        ThemeService,
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ matches: false, breakpoints: {} }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AiLabNavbarComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render brand and desktop navigation', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('AI Lab');
    expect(text).toContain('AI Services');
    expect(text).toContain('Apps Manager');
  });

  it('should close mobile menu', () => {
    const component = fixture.componentInstance as unknown as {
      mobileMenuOpen: { set(value: boolean): void; (): boolean };
      closeMobileMenu(): void;
    };

    component.mobileMenuOpen.set(true);
    component.closeMobileMenu();
    expect(component.mobileMenuOpen()).toBe(false);
  });
});
