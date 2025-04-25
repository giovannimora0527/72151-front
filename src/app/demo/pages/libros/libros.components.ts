import { Component } from '@angular/core';
import { LibrosService } from './service/libros.service';

@Component({
  selector: 'app-libros',
  imports: [],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.scss'
})
export class LibrosComponent {

  constructor(private librosService: LibrosService) {
   this.librosService.test();
  }
}
