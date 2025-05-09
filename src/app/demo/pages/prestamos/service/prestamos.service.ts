import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { prestamoRq } from 'src/app/models/prestamoRq';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class prestamoService {
  private api = `prestamos`;

  constructor(private backendService: BackendService) {}

  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar")
  }

  crearPrestamos(prestamo: prestamoRq): Observable<RespuestaGenerica> {
    return this.backendService.post<RespuestaGenerica>(environment.apiUrl, this.api, "crear-prestamo", prestamo);
  }

  actualizarPrestamos(idPrestamo: number, fechaEntrega: string): Observable<RespuestaGenerica> {
    const endpoint = `actualizar-prestamo/${idPrestamo}`;
    const body = { fechaEntrega: fechaEntrega };
    return this.backendService.post<RespuestaGenerica>(environment.apiUrl, this.api, endpoint, body);
  }

  archivarPrestamo(idPrestamo: number): Observable<RespuestaGenerica> {
    const endpoint = `${idPrestamo}`;
    return this.backendService.delete<RespuestaGenerica>(environment.apiUrl, this.api, endpoint); 
  }
}