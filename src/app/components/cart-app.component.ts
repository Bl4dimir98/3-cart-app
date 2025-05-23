import { Component, OnInit } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { ItemsState } from '../store/items.reducer';
import { add, remove, total } from '../store/items.actions';

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {

  items: CartItem[] = [];

  constructor(
    private store: Store<{ items: ItemsState }>,
    private router: Router,
    private sharingDataService: SharingDataService) {
    this.store.select('items').subscribe(state => {
      this.items = state.items;
      this.saveSession();
      console.log('cambio el estado');
    });
  }

  ngOnInit(): void {
    this.onDeleteCart();
    this.onAddCart();
  }

  onAddCart(): void {
    this.sharingDataService.productEventEmmiter.subscribe(product => {

      this.store.dispatch(add({ product: product }));
      this.store.dispatch(total())

      this.router.navigate(['/cart'])
      Swal.fire({
        title: "Shopping Cart",
        text: "Nuevo producto agregado al carro!",
        icon: "success"
      });
    });
  }

  onDeleteCart(): void {
    this.sharingDataService.idProductEventEmmiter.subscribe(id => {
      console.log(id + ' se ha ejecutado el evento idProductEventEmmiter');
      Swal.fire({
        title: "¿Está seguro que desea eliminar?",
        text: "Cuidado!, el item se eliminará del carro de compras",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Si, eliminar!"
      }).then((result) => {
        if (result.isConfirmed) {

          this.store.dispatch(remove({ id: id }));
          this.store.dispatch(total());

          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/cart']);
          });

          Swal.fire({
            title: "¡Eliminado!",
            text: "Producto eliminado del carro de compras",
            icon: "success"
          });
        }
      });
    });
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

}
