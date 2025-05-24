import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioRs } from 'src/app/models/usuarioRs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private api = `usuario`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarUsuario(usuario: Usuario): Observable<UsuarioRs> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-usuario", usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<UsuarioRs> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-usuario", usuario);
  }

  uploadUsers(fileContent: string): Observable<any> {
    const uploadApi = `${this.api}/cargar-usuarios`;
    const headers: HttpHeaders = new HttpHeaders({ // Especificamos el tipo de 'headers'
      'Content-Type': 'text/plain'
    });
    return this.backendService.post(
      environment.apiUrl, uploadApi, null, fileContent,
    );
  }
}