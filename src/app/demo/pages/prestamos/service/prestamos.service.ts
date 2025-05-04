import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
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
    return this.backendService.get(environment.apiUrl, this.api, "prestamo")
  }

  crearPrestamos(prestamo: Prestamo): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "crear-Prestamo", prestamo); 
  }

  actualizarPrestamos(prestamo: Prestamo) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-prestamo", prestamo);
  }

}
