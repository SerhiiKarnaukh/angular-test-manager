import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AlertService } from '@core/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

import { ProfilePageComponent } from './profile-page.component';
import { SocialPostsStore } from '@features/social/posts/data-access/social-posts.store';

describe('ProfilePageComponent', () => {
  let fixture: ComponentFixture<ProfilePageComponent>;
  let httpMock: HttpTestingController;
  let postsStore: SocialPostsStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AlertService,
        AuthService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ slug: 'john' }) },
            paramMap: of(convertToParamMap({ slug: 'john' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    httpMock = TestBed.inject(HttpTestingController);
    postsStore = TestBed.inject(SocialPostsStore);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render profile name after load', async () => {
    fixture.detectChanges();

    const profileRequest = httpMock.expectOne('/api/social-posts/profile/john/');
    profileRequest.flush({
      results: {
        posts: [],
        profile: {
          id: 1,
          slug: 'john',
          first_name: 'John',
          last_name: 'Doe',
          avatar_url: null,
          friends_count: 2,
          posts_count: 3,
        },
        can_send_friendship_request: true,
      },
      next: null,
    });

    const trendsRequest = httpMock.expectOne('/api/social-posts/trends/');
    trendsRequest.flush([]);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(postsStore.viewedProfile()?.first_name).toBe('John');
    expect(postsStore.viewedProfile()?.friends_count).toBe(2);
  });
});
