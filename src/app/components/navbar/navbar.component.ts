import { Component, Input } from '@angular/core';
import { CartItem } from '../../models/cart-item';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  @Input() items: CartItem[] = [];

}
