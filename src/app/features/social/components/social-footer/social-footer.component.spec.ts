import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';

import { SocialFooterComponent } from './social-footer.component';

describe('SocialFooterComponent', () => {
  let fixture: ComponentFixture<SocialFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialFooterComponent],
      providers: [provideRouter([]), AuthService],
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
