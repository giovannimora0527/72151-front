import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { Prestamo } from 'src/app/models/prestamo';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private readonly api = `prestamo`;

  constructor(private readonly backendService: BackendService) { }

  listar(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  listarLibrosDisponibles(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar-disponibles");
  }


  crearPrestamo(user: Prestamo): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-prestamo", user);
  }

}
