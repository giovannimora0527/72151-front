import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { Multa } from 'src/app/models/multa';

@Injectable({
  providedIn: 'root'
})
export class MultaService {

  private api = `multa`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getMultas(): Observable<Multa[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  crearMulta(multa: Multa) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-multa", multa);
  } // De momento este metodo NO le apunta a nada en el backend

  actualizarMulta(multa: Multa) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-multa", multa);
  }

}
