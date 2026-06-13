import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingService } from '@core/loading/loading.service';
import { AiLabStore } from '@features/ai-lab/data-access/ai-lab.store';

import { RealtimeChatComponent } from './realtime-chat.component';

describe('RealtimeChatComponent', () => {
  let fixture: ComponentFixture<RealtimeChatComponent>;
  let store: AiLabStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimeChatComponent],
      providers: [LoadingService],
    }).compileComponents();

    store = TestBed.inject(AiLabStore);
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

  it('should render user and assistant messages', () => {
    store['realtimeMessagesState'].set([
      { sender: 'me', message: 'hello' },
      { sender: 'chat', message: 'hi there' },
    ]);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('hello');
    expect(element.textContent).toContain('hi there');
    expect(element.querySelectorAll('.message-row--sender').length).toBe(1);
  });

  it('should identify sender messages', () => {
    const component = fixture.componentInstance as unknown as {
      isSender(message: { sender: string }): boolean;
    };

    expect(component.isSender({ sender: 'me' })).toBe(true);
    expect(component.isSender({ sender: 'chat' })).toBe(false);
  });
});
