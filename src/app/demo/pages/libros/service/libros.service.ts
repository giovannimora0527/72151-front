import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libros';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private api = `libro`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrlAuth, this.api, "test").subscribe({
      next: (data) => console.log("Test Response:", data),
      error: (err) => console.error("Test Error:", err)
    });
  }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, 'listar');
  }
}
