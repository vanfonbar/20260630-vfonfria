import { Component } from '@angular/core';
import { IMAGES } from './embedded-images';

@Component({
  selector: 'app-welcome-to-fwka',
  templateUrl: './welcome-to-fwka.component.html',
  styleUrls: ['./welcome-to-fwka.component.scss']
})
export class WelcomeToFwkaComponent {
  images = IMAGES;

  constructor() {}

  goToUrl(url: string): void {
    window.open(url, '_blank');
  }
}
