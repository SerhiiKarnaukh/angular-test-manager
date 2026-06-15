import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGridSkeletonComponent } from './card-grid-skeleton.component';

describe('CardGridSkeletonComponent', () => {
  let fixture: ComponentFixture<CardGridSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGridSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardGridSkeletonComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render placeholder cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.skeleton-card');
    expect(cards.length).toBe(6);
  });

  it('should expose loading status for assistive tech', () => {
    const status = fixture.nativeElement.querySelector('[role="status"]');
    expect(status?.getAttribute('aria-label')).toBe('Loading content');
  });
});
