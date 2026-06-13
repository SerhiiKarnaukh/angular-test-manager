import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';

import { PromptFormComponent } from './prompt-form.component';

describe('PromptFormComponent', () => {
  let fixture: ComponentFixture<PromptFormComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let alert: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'ai-lab', component: PromptFormComponent },
          { path: 'ai-lab/image-generator', component: PromptFormComponent },
          { path: 'ai-lab/voice-generator', component: PromptFormComponent },
          { path: 'ai-lab/realtime-chat', component: PromptFormComponent },
        ]),
        AlertService,
        LoadingService,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    alert = TestBed.inject(AlertService);
    fixture = TestBed.createComponent(PromptFormComponent);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show Ask Me label on chat route', async () => {
    await router.navigateByUrl('/ai-lab');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement | null;
    expect(submitButton?.textContent?.trim()).toBe('Ask Me');
  });

  it('should show Generate label on image route', async () => {
    await router.navigateByUrl('/ai-lab/image-generator');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement | null;
    expect(submitButton?.textContent?.trim()).toBe('Generate');
  });

  it('should post chat prompt to ai-lab endpoint', async () => {
    await router.navigateByUrl('/ai-lab');
    fixture.detectChanges();

    (fixture.componentInstance as unknown as { form: { controls: { prompt: { setValue(value: string): void } } } })
      .form.controls.prompt.setValue('Hello AI');
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.requestSubmit();

    const request = httpMock.expectOne('/ai-lab/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      question: 'Hello AI',
      prompt_images: [],
    });
    request.flush({ message: 'Hi there' });

    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      form: { controls: { prompt: { value: string; touched: boolean } } };
      promptFieldError(): string | null;
    };
    expect(component.form.controls.prompt.value).toBe('');
    expect(component.form.controls.prompt.touched).toBe(false);
    expect(component.promptFieldError()).toBeNull();
  });

  it('should show validation after empty submit', async () => {
    await router.navigateByUrl('/ai-lab');
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.requestSubmit();
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      promptFieldError(): string | null;
    };
    expect(component.promptFieldError()).toBe('Prompt is required');
    httpMock.expectNone('/ai-lab/');
  });

  it('should show Generate label on voice route', async () => {
    await router.navigateByUrl('/ai-lab/voice-generator');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement | null;
    expect(submitButton?.textContent?.trim()).toBe('Generate');
  });

  it('should show Ask Me label on realtime route', async () => {
    await router.navigateByUrl('/ai-lab/realtime-chat');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement | null;
    expect(submitButton?.textContent?.trim()).toBe('Ask Me');
  });

  it('should post image prompt to image-generator endpoint', async () => {
    await router.navigateByUrl('/ai-lab/image-generator');
    fixture.detectChanges();

    (fixture.componentInstance as unknown as { form: { controls: { prompt: { setValue(value: string): void } } } })
      .form.controls.prompt.setValue('Draw a cat');
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.requestSubmit();

    const request = httpMock.expectOne('/ai-lab/image-generator/');
    expect(request.request.body).toEqual({ question: 'Draw a cat' });
    request.flush({ message: 'https://img.test/a.png' });
    await fixture.whenStable();
  });

  it('should submit on Enter without Shift', async () => {
    await router.navigateByUrl('/ai-lab');
    fixture.detectChanges();

    (fixture.componentInstance as unknown as { form: { controls: { prompt: { setValue(value: string): void } } } })
      .form.controls.prompt.setValue('Quick question');
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();

    const request = httpMock.expectOne('/ai-lab/');
    request.flush({ message: 'Answer' });
    await fixture.whenStable();
  });

  it('should show Add Images controls on chat route', async () => {
    await router.navigateByUrl('/ai-lab');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Add Images');
  });

  it('should hide Add Images controls on image route', async () => {
    await router.navigateByUrl('/ai-lab/image-generator');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeNull();
  });

  it('should reject oversized image uploads with error toast', async () => {
    await router.navigateByUrl('/ai-lab');
    fixture.detectChanges();

    const oversized = new File(['x'], 'big.png', { type: 'image/png' });
    Object.defineProperty(oversized, 'size', { value: 21 * 1024 * 1024 });
    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', { value: [oversized] });
    input.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(alert.message()?.type).toBe('error');
    expect(alert.message()?.value[0]).toContain('big.png');
    httpMock.expectNone('/ai-lab/upload-vision-images/');
  });
});
