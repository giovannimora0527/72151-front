import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
<<<<<<< HEAD
import { RespuestaGenerica } from 'src/app/models/respuesta-gen';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
=======
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment'
>>>>>>> 1b362df161768992ba20c39c95b5c1cb059cbca2

@Injectable({
  providedIn: 'root'
})
export class LibroService {
<<<<<<< HEAD
  private api = `libro`;

  constructor(private backendService: BackendService) {}

  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar")
  }

  crearLibro(libro: Libro): Observable<RespuestaGenerica> {
    return this.backendService.post(environment.apiUrl, this.api, "crear-libro", libro); 
  }

}
=======
    private api = `libro`;

    constructor(private backendService: BackendService) {
        this.testService();
    }
    testService() {
        this.backendService.get(environment.apiUrl, this.api,"test");
    }
    
    getLibros(): Observable<Libro[]> {
        return this.backendService.get(environment.apiUrl, this.api,"listar");
    }

}
>>>>>>> 1b362df161768992ba20c39c95b5c1cb059cbca2
