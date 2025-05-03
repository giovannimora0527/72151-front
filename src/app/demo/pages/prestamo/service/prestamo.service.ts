import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { PrestamoActualizarRq } from 'src/app/models/prestamoActualizarRq';
import { PrestamoRq } from 'src/app/models/prestamoRq';
import { RespuestaGenericaRs } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private apiUrl = `${environment.apiUrl}/prestamo`;

  constructor(private backendService: BackendService) { }

  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(`${this.apiUrl}/listar`);
  }

  crearPrestamo(prestamo: PrestamoRq): Observable<RespuestaGenericaRs> {
    return this.backendService.post(`${this.apiUrl}/crear`, prestamo);
  }

  actualizarPrestamo(prestamo: PrestamoActualizarRq): Observable<RespuestaGenericaRs> {
    return this.backendService.post(`${this.apiUrl}/actualizar`, prestamo);
  }
}