import { Component, OnInit } from '@angular/core';

import { MLoggerService } from '@mercadona/core/logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private mLoggerService: MLoggerService) {}

  ngOnInit(): void {
    this.mLoggerService.log('Welcome to FWK Front Angular Responsive');
  }

  goToUrl(url: string): void {
    window.open(url, '_blank');
  }
}
