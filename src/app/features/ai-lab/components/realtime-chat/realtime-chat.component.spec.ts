import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingService } from '@core/loading/loading.service';

import { RealtimeChatComponent } from './realtime-chat.component';

describe('RealtimeChatComponent', () => {
  let fixture: ComponentFixture<RealtimeChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimeChatComponent],
      providers: [LoadingService],
    }).compileComponents();

    fixture = TestBed.createComponent(RealtimeChatComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render empty state before messages', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Start a conversation');
  });
});
