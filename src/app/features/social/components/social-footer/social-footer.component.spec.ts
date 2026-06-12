import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';

import { SocialFooterComponent } from './social-footer.component';

describe('SocialFooterComponent', () => {
  let fixture: ComponentFixture<SocialFooterComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [SocialFooterComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AlertService,
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialFooterComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render footer navigation links', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Home');
    expect(text).toContain('All Apps');
    expect(text).toContain('Social Network');
  });
});
