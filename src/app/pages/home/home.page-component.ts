import { Component } from '@angular/core';
import { IMAGES } from './embedded-images';

@Component({
  selector: 'app-home',
  templateUrl: './home.page-component.html',
  styleUrls: ['./home.page-component.scss']
})
export class HomePageComponent {
  images = IMAGES;

  constructor() {}

  goToUrl(url: string): void {
    window.open(url, '_blank');
  }
}
