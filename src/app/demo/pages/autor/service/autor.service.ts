import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { RespuestaGenericaRs } from 'src/app/models/respuesta-gen';
import { AutorRq } from 'src/app/models/autorRq';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private apiUrl = `${environment.apiUrl}/autor`;

  constructor(private backendService: BackendService) {}

  listarAutores(): Observable<Autor[]> {
    return this.backendService.get(`${this.apiUrl}/listar`);
  }

  crearAutor(autor: AutorRq): Observable<RespuestaGenericaRs> {
    return this.backendService.post(`${this.apiUrl}/crear`, autor);
  }

  actualizarAutor(autor: Autor): Observable<RespuestaGenericaRs> {
    return this.backendService.put(`${this.apiUrl}/actualizar`, autor);
  }
}