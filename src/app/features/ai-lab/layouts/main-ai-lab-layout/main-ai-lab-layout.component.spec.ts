import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlertService } from '@core/alert/alert.service';
import { LoadingService } from '@core/loading/loading.service';
import { AiLabStore } from '@features/ai-lab/data-access/ai-lab.store';

import { MainAiLabLayoutComponent } from './main-ai-lab-layout.component';

describe('MainAiLabLayoutComponent', () => {
  let fixture: ComponentFixture<MainAiLabLayoutComponent>;
  let store: AiLabStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainAiLabLayoutComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AlertService,
        LoadingService,
      ],
    }).compileComponents();

    store = TestBed.inject(AiLabStore);
    fixture = TestBed.createComponent(MainAiLabLayoutComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render navbar, outlet and footer', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-ai-lab-navbar')).toBeTruthy();
    expect(element.querySelector('router-outlet')).toBeTruthy();
    expect(element.querySelector('app-ai-lab-footer')).toBeTruthy();
  });

  it('should connect realtime socket on init and disconnect on destroy', () => {
    const connect = vi.spyOn(store, 'connectRealtimeSocket').mockResolvedValue(undefined);
    const disconnect = vi.spyOn(store, 'disconnectRealtimeSocket');

    fixture.detectChanges();
    expect(connect).toHaveBeenCalled();

    fixture.destroy();
    expect(disconnect).toHaveBeenCalled();
  });
});
