import { Component, OnInit } from '@angular/core';
import { LibroService } from './service/libro.service';

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.scss'] 
})
export class LibroComponent implements OnInit {

  libros: any[] = [];

  constructor(private libroService: LibroService) {}

  ngOnInit(): void {
    this.libros = this.libroService.getLibros();
  }
}
