import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTypingIndicatorComponent } from './typing-indicator.component';

describe('AiTypingIndicatorComponent', () => {
  let fixture: ComponentFixture<AiTypingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiTypingIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AiTypingIndicatorComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render loading indicator dots', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.typing-indicator')?.getAttribute('aria-label')).toBe(
      'Loading response',
    );
    expect(element.querySelectorAll('.dot').length).toBe(3);
  });
});
