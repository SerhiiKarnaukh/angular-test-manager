import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';
import { AiLabStore } from '@features/ai-lab/data-access/ai-lab.store';

import { ImageGeneratorPageComponent } from './image-generator-page.component';

describe('ImageGeneratorPageComponent', () => {
  let fixture: ComponentFixture<ImageGeneratorPageComponent>;
  let store: AiLabStore;
  let title: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGeneratorPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AlertService,
        LoadingService,
      ],
    }).compileComponents();

    store = TestBed.inject(AiLabStore);
    title = TestBed.inject(Title);
    fixture = TestBed.createComponent(ImageGeneratorPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set document title on init', () => {
    fixture.detectChanges();
    expect(title.getTitle()).toBe('Image Generator | AI Lab');
  });

  it('should render page title and prompt form', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Image Generator');
    expect(element.querySelector('app-prompt-form')).toBeTruthy();
  });

  it('should render generated image and download action', () => {
    store['imageUrlState'].set('https://img.test/generated.png');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.generated-image')?.getAttribute('src')).toBe(
      'https://img.test/generated.png',
    );
    expect(element.textContent).toContain('Download Image');
  });

  it('should call store download when download button is clicked', () => {
    const downloadImage = vi.spyOn(store, 'downloadImage').mockResolvedValue(undefined);
    store['imageUrlState'].set('https://img.test/generated.png');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement;
    button.click();

    expect(downloadImage).toHaveBeenCalledWith('https://img.test/generated.png');
  });
});
