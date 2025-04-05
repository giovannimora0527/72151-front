// src/app/demo/pages/libro/service/libro.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';
import { environment } from 'src/environments/environment';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { Libro } from 'src/app/models/libro';
import { libroRq } from 'src/app/models/libroRq';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private api = 'libro';

  constructor(private backendService: BackendService) { }

  test(): Observable<any> {
    return this.backendService.get(environment.apiUrl, this.api, 'test');
  }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get<Libro[]>(environment.apiUrl, this.api, 'listar');
  }

  crearLibro(book: libroRq): Observable<RespuestaGenerica> {
    return this.backendService.post<RespuestaGenerica>(environment.apiUrl, this.api, 'guardar-libro', book);
  }

  actualizarLibro(id: number, book: libroRq): Observable<RespuestaGenerica> {
    return this.backendService.post<RespuestaGenerica>(environment.apiUrl, this.api, 'actualizar-libro', { id, ...book });
  }
}