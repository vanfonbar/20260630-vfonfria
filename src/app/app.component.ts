import { Component, OnInit, inject } from '@angular/core';

import { MLoggerService } from '@mercadona/core/logger';
import { WINDOW } from '@mercadona/core/utils/tokens';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  protected _window = inject(WINDOW);
  constructor(private mLoggerService: MLoggerService) {}

  ngOnInit(): void {
    this.mLoggerService.log('Welcome to FWK Front Angular Responsive');
  }
}
