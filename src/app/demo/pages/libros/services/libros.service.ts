import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro/libro';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private api = `libro`;

  constructor(private backendService: BackendService) { }
  
  getLibrosDiponibles(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "disponibles");
  }
}
