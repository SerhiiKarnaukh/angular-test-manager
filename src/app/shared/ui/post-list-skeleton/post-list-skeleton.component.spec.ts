import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListSkeletonComponent } from './post-list-skeleton.component';

describe('PostListSkeletonComponent', () => {
  let fixture: ComponentFixture<PostListSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListSkeletonComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render skeleton cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.post-skeleton-card');
    expect(cards.length).toBe(3);
  });
});
