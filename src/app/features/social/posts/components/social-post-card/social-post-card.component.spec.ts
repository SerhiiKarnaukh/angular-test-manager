import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SocialPostCardComponent } from './social-post-card.component';

describe('SocialPostCardComponent', () => {
  let fixture: ComponentFixture<SocialPostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialPostCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialPostCardComponent);
    fixture.componentRef.setInput('post', {
      id: 1,
      body: 'Test post body',
      created_at_formatted: '2h',
      likes_count: 3,
      comments_count: 1,
      is_private: false,
      created_by: {
        id: 2,
        slug: 'jane',
        first_name: 'Jane',
        last_name: 'Doe',
        avatar_url: null,
      },
      attachments: [],
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render post body and author', () => {
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Test post body');
    expect(text).toContain('Jane Doe');
    expect(text).toContain('1 comments');
  });
});
