import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo/prestamo';
import { PrestamoActualizarRq } from 'src/app/models/prestamo/prestamoActualizarRq';
import { PrestamoRq } from 'src/app/models/prestamo/prestamoRq';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private api = `prestamo`;

  constructor(private backendService: BackendService) { }
  
  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  crearPrestamo(prestamo: PrestamoRq) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "crear", prestamo);
  }

  actualizarPrestamo(prestamo: PrestamoActualizarRq) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar", prestamo);
  }
}
