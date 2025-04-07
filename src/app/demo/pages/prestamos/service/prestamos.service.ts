import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  constructor() {}

  getPrestamos() {
    return [
      { id: 1, libro: 'Cien años de soledad', usuario: 'Juan', fecha: '2024-04-01' },
    ];
  }
}