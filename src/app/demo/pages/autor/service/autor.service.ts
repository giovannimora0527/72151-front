import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor/autor';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { AutorRq } from 'src/app/models/autor/autorRq';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private api = `autor`;

  constructor(private backendService: BackendService) { 
    this.test();
  }

  test() {
    this.backendService.get(this.api, "app", "test").subscribe(
      {
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        },
      }
    );
  }
  
  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  crearAutor(autor: AutorRq) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "crear", autor);
  }

  actualizarAutor(autor: Autor) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar", autor);
  }
}
