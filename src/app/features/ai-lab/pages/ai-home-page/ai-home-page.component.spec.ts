import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';

import { AiHomePageComponent } from './ai-home-page.component';

describe('AiHomePageComponent', () => {
  let fixture: ComponentFixture<AiHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiHomePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AlertService,
        LoadingService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AiHomePageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render page title and prompt form', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Funny Chat');
    expect(element.querySelector('app-prompt-form')).toBeTruthy();
  });
});
