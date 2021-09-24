import { Component, OnInit } from '@angular/core';
import { IMAGES } from './embedded-images';
import { MLoggerService } from '@mercadona/core/logger';

@Component({
  selector: 'app-home',
  templateUrl: './home.page-component.html',
  styleUrls: ['./home.page-component.scss']
})
export class HomePageComponent implements OnInit{
  images = IMAGES;

  constructor(private mLoggerService: MLoggerService) {}

  ngOnInit(): void {
    this.mLoggerService.log('Welcome to FWK Front Angular Responsive');
  }

  goToUrl(url: string): void {
    window.open(url, '_blank');
  }
}
