import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';

import { RealtimeChatPageComponent } from './realtime-chat-page.component';

describe('RealtimeChatPageComponent', () => {
  let fixture: ComponentFixture<RealtimeChatPageComponent>;
  let title: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimeChatPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AlertService,
        LoadingService,
      ],
    }).compileComponents();

    title = TestBed.inject(Title);
    fixture = TestBed.createComponent(RealtimeChatPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set document title on init', () => {
    fixture.detectChanges();
    expect(title.getTitle()).toBe('Realtime Chat | AI Lab');
  });

  it('should render chat area and prompt form', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Realtime Chat');
    expect(element.querySelector('app-realtime-chat')).toBeTruthy();
    expect(element.querySelector('app-prompt-form')).toBeTruthy();
  });
});
