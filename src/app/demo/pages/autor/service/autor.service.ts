import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { AutorRq } from 'src/app/models/autorRq';
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  api = "autor";

  constructor(private backendService: BackendService) { 
   
  }

  listarAutores(): Observable<Autor[]>  {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  crearAutor(autor: AutorRq): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-autor", autor); 
 }
  
 actualizarAutor(autor: Autor) : Observable<RespuestaGenerica> {
     return this.backendService.post(environment.apiUrl, this.api, "actualizar-autor", autor);
   }
}
