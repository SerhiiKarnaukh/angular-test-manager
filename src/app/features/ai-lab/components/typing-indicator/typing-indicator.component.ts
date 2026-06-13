import { Component } from '@angular/core';

@Component({
  selector: 'app-ai-typing-indicator',
  template: `
    <div class="typing-indicator" aria-label="Loading response">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  `,
  styles: `
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #999;
      animation: typing 1.4s infinite ease-in-out;
    }

    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%,
      60%,
      100% {
        opacity: 0.3;
        transform: scale(0.8);
      }

      30% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
})
export class AiTypingIndicatorComponent {}
