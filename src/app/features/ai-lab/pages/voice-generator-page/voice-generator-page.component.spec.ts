import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';
import { AiLabStore } from '@features/ai-lab/data-access/ai-lab.store';

import { VoiceGeneratorPageComponent } from './voice-generator-page.component';

describe('VoiceGeneratorPageComponent', () => {
  let fixture: ComponentFixture<VoiceGeneratorPageComponent>;
  let store: AiLabStore;
  let title: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceGeneratorPageComponent],
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
    fixture = TestBed.createComponent(VoiceGeneratorPageComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set document title on init', () => {
    fixture.detectChanges();
    expect(title.getTitle()).toBe('Voice Generator | AI Lab');
  });

  it('should render page title and prompt form', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Voice Generator');
    expect(element.querySelector('app-prompt-form')).toBeTruthy();
  });

  it('should render audio player when voice url is available', () => {
    store['voiceMessageState'].set('https://audio.test/generated.mp3');
    fixture.detectChanges();

    const audio = fixture.nativeElement.querySelector('audio') as HTMLAudioElement;
    expect(audio.src).toContain('https://audio.test/generated.mp3');
    expect(audio.hasAttribute('controls')).toBe(true);
  });
});
