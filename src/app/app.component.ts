import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MBadgeDirective } from '@mercadona/components/badge';
import { MTranslatePipe } from '@mercadona/core/translate';

import { CartStorageService } from '@/presentation/services/cart-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MBadgeDirective, MTranslatePipe]
})
export class AppComponent {
  protected readonly cartStorage: CartStorageService = inject(CartStorageService);
}
