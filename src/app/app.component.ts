import { Component, OnInit } from '@angular/core';
import { MLoggerService } from '@mercadona-fwk-front/core/logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private mLoggerService: MLoggerService
  ) {
  }

  ngOnInit(): void {
    this.mLoggerService.log('Welcome to FWK Front Angular Responsive');
  }


}
