import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioRq } from 'src/app/models/usuarioRq';
import { RespuestaGenericaRs } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuario`;

  constructor(private backendService: BackendService) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(`${this.apiUrl}/listar`);
  }

  crearUsuario(usuario: UsuarioRq): Observable<RespuestaGenericaRs> {
    return this.backendService.post(`${this.apiUrl}/crear`, usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<RespuestaGenericaRs> {
    return this.backendService.post(`${this.apiUrl}/actualizar`, usuario);
  }
}