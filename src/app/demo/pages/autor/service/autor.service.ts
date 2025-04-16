import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private readonly api = 'autor';

  constructor(private readonly backendService: BackendService) {}

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }


  listarAutores() {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }
  
  getAutorPorId(autorId: number): Observable<Autor> {
    return this.backendService.get(environment.apiUrl, this.api, `listar-por-id/${autorId}`);
  }

  crearAutor(autor: Autor): Observable<Autor> {
    return this.backendService.post(environment.apiUrl, this.api, 'guardar-autor', autor);
  }

  actualizarAutor(autor: Autor): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, 'actualizar-autor', autor);
  }
}
