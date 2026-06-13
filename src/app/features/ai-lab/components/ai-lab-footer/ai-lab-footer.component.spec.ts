import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AiLabFooterComponent } from './ai-lab-footer.component';

describe('AiLabFooterComponent', () => {
  let fixture: ComponentFixture<AiLabFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLabFooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AiLabFooterComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render footer links and branding', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('All Apps');
    expect(text).toContain('Angular Apps');
    expect(text).toContain('AI Lab');
  });
});
