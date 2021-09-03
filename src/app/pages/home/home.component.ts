import { Component } from '@angular/core';
import { IMAGES } from './embedded-images';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  images = IMAGES;

  constructor() {}

  goToUrl(url: string): void {
    window.open(url, '_blank');
  }
}
