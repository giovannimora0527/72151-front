import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
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
}
