import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  constructor() {}

  getLibros() {
    // Aquí podrías hacer una llamada a la API para traer los libros
    return [
      { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez' },
    ];
  }
}
