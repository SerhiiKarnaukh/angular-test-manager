import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';

import { SocialSearchPageComponent } from './social-search-page.component';

describe('SocialSearchPageComponent', () => {
  let fixture: ComponentFixture<SocialSearchPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialSearchPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AlertService,
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialSearchPageComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show search form', async () => {
    fixture.detectChanges();

    const trendsRequest = httpMock.expectOne('/api/social-posts/trends/');
    trendsRequest.flush([]);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('What are you looking for?');
  });
});
