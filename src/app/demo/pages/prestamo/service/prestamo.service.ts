import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private readonly api = 'prestamo';

  constructor(private readonly backendService: BackendService) {}

  listarPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }

  getPrestamoPorId(prestamoId: number): Observable<Prestamo> {
    return this.backendService.get(environment.apiUrl, this.api, `listar-prestamo-id?prestamoId=${prestamoId}`);
  }

  crearPrestamo(prestamo: Prestamo): Observable<Prestamo> {
    return this.backendService.post(environment.apiUrl, this.api, 'guardar-prestamo', prestamo);
  }

  actualizarPrestamo(prestamo: Prestamo): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, 'actualizar-prestamo', prestamo);
  }
}

