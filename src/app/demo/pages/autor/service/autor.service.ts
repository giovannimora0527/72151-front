import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { AutorRq } from 'src/app/models/autorRq';
import { BackendService } from 'src/app/services/backend.service';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private api = `autor`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrl, this.api,"test");
  }

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api,"listar");
  }

  crearAutor(autor: AutorRq) : Observable<RespuestaGenerica> {
      return this.backendService.post(environment.apiUrl, this.api, "guardar-autor", autor);
    }
  
    actualizarAutor(autor: Autor) : Observable<RespuestaGenerica> {
      return this.backendService.post(environment.apiUrl, this.api, "actualizar-autor", autor);
    }
}
