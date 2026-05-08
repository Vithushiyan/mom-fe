import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FloatingElement {
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

@Component({
  selector: 'app-flower-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flower-container">
      @for (element of floatingElements; track $index) {
        <span
          class="floating-element"
          [style.left.%]="element.left"
          [style.animation-delay.s]="element.delay"
          [style.animation-duration.s]="element.duration"
          [style.font-size.rem]="element.size"
        >
          {{ element.emoji }}
        </span>
      }
    </div>
  `,
  styles: [`
    .flower-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }

    .floating-element {
      position: absolute;
      bottom: -50px;
      animation: rise linear infinite;
      opacity: 0.7;
    }

    @keyframes rise {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.7;
      }
      90% {
        opacity: 0.7;
      }
      100% {
        transform: translateY(-110vh) rotate(360deg);
        opacity: 0;
      }
    }
  `]
})
export class FlowerAnimationComponent implements OnInit {
  floatingElements: FloatingElement[] = [];

  private emojis = ['🌸', '🌺', '🌷', '💮', '🌹', '💐', '🪻', '🌼', '💕', '💗'];

  ngOnInit() {
    this.generateElements();
  }

  private generateElements() {
    const count = 15;

    for (let i = 0; i < count; i++) {
      this.floatingElements.push({
        emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)],
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 10,
        size: 1.5 + Math.random() * 1.5
      });
    }
  }
}
