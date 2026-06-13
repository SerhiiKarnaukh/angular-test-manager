import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';

import { PromptFormComponent } from './prompt-form.component';

describe('PromptFormComponent', () => {
  let fixture: ComponentFixture<PromptFormComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'ai-lab', component: PromptFormComponent },
          { path: 'ai-lab/image-generator', component: PromptFormComponent },
        ]),
        AlertService,
        LoadingService,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(PromptFormComponent);
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
});
