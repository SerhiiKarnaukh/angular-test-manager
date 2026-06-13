import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiLabPageLayoutComponent } from './ai-lab-page-layout.component';

describe('AiLabPageLayoutComponent', () => {
  let fixture: ComponentFixture<AiLabPageLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLabPageLayoutComponent],
    }).compileComponents();

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });

    fixture = TestBed.createComponent(AiLabPageLayoutComponent);
    fixture.componentRef.setInput('title', 'Funny Chat');
    fixture.componentRef.setInput('heroImage', '/ai_lab.jpg');
    fixture.detectChanges();

    const hero = fixture.nativeElement.querySelector('.hero-banner') as HTMLElement;
    Object.defineProperty(hero, 'offsetHeight', { value: 400, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render page title and hero background', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Funny Chat');
    expect(element.querySelector('.hero-bg')?.getAttribute('style')).toContain('/ai_lab.jpg');
  });

  it('should scroll to content when hint is clicked', () => {
    const pageContent = fixture.nativeElement.querySelector('.page-content') as HTMLElement;
    pageContent.scrollIntoView = vi.fn();

    const hint = fixture.nativeElement.querySelector('.scroll-hint') as HTMLButtonElement;
    hint.click();

    expect(pageContent.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('should hide scroll hint after scrolling past hero', () => {
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true, writable: true });

    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      showScrollHint(): boolean;
    };
    expect(component.showScrollHint()).toBe(false);
  });
});
