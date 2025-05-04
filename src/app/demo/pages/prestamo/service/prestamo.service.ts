import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { Prestamo } from 'src/app/models/prestamo';
import { PrestamoRq } from 'src/app/models/prestamoRq';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private api = `prestamo`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  crearPrestamo(prestamo: PrestamoRq) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-prestamo", prestamo);
  }

  actualizarPrestamo(prestamo: Prestamo) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-prestamo", prestamo);
  }
}
