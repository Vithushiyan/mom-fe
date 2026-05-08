import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowerAnimationComponent } from './shared/components/flower-animation/flower-animation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlowerAnimationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Pretty Cups';
}
