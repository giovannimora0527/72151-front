import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Deuda } from 'src/app/models/deuda';
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {
  private readonly api = 'deuda';

  constructor(private readonly backendService: BackendService) {}

  listarDeudas(): Observable<Deuda[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }

  getDeudaPorId(deudaId: number): Observable<Deuda> {
    return this.backendService.get(environment.apiUrl, this.api, `listar-deuda-id?deudaId=${deudaId}`);
  }


  
  crearDeuda(deuda: Deuda): Observable<Deuda> {
    return this.backendService.post(environment.apiUrl, this.api, 'guardar', deuda);
  }

actualizarDeuda(deuda: any): Observable<any> {
  return this.backendService.post(environment.apiUrl, this.api, 'actualizar', deuda);
}

  listarDeudasPorUsuario(usuarioId: number): Observable<Deuda[]> {
    return this.backendService.get(environment.apiUrl, this.api, `listar-deudas-por-usuario?usuarioId=${usuarioId}`);
  }

  cancelarDeuda(deuda: Deuda): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, 'cancelar-deuda', deuda);
  }

  
}
