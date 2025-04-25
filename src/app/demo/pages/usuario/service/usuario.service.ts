import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { Usuario } from 'src/app/models/usuario';
=======
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioRq } from 'src/app/models/usuarioRq';
>>>>>>> 267e173 (Frontend corte 2)
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private api = `usuario`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService() {
<<<<<<< HEAD
    this.backendService.get(environment.apiUrlAuth, this.api, "test");
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, "listar");
=======
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  crearUsuario(user: UsuarioRq) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-usuario", user);
  }

  actualizarUsuario(user: Usuario) : Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-usuario", user);
>>>>>>> 267e173 (Frontend corte 2)
  }
}
