import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';

import { FeedHomePageComponent } from './feed-home-page.component';

describe('FeedHomePageComponent', () => {
  let fixture: ComponentFixture<FeedHomePageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedHomePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AlertService,
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedHomePageComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render feed posts after load', async () => {
    fixture.detectChanges();

    const feedRequest = httpMock.expectOne('/api/social-posts/');
    feedRequest.flush({
      results: {
        posts: [
          {
            id: 1,
            body: 'Hello feed',
            created_at_formatted: '1h',
            likes_count: 0,
            comments_count: 0,
            is_private: false,
            created_by: {
              id: 1,
              slug: 'john',
              first_name: 'John',
              last_name: 'Doe',
              avatar_url: null,
            },
            attachments: [],
          },
        ],
      },
      next: null,
    });

    const trendsRequest = httpMock.expectOne('/api/social-posts/trends/');
    trendsRequest.flush([]);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Hello feed');
  });
});
