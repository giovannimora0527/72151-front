import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { RespuestaGenericaRs } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { LibroRq } from 'src/app/models/libroRq'; // Asegúrate de importar el modelo correctamente.

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private api = `${environment.apiUrl}/biblioteca/v1`;

  constructor(private backendService: BackendService) { }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get(`${this.api}/listar-libros`);
  }

  crearLibro(libroRq: LibroRq): Observable<RespuestaGenericaRs> {
    return this.backendService.post(`${this.api}/crear-libro`, libroRq);
  }

  actualizarLibro(libroRq: LibroRq): Observable<RespuestaGenericaRs> {
    return this.backendService.put(`${environment.apiUrl}/biblioteca/v1/actualizar-libro`, libroRq);
  }
}