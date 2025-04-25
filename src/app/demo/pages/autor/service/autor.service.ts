import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { environment } from 'src/environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor } from '/Users/samuelmartin/Documents/72151-front/src/app/models/autor';

@Injectable({
  providedIn: 'root'
})

export class AutorService {
  private apiUrl = `http://localhost:8000/biblioteca/v1/autor`;

  constructor(private http: HttpClient) { }

  getAutores(): Observable<Autor[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.get<Autor[]>(`${this.apiUrl}/listar`);
  }

  // Crear nuevo autor
  crearAutor(autor: Autor): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Autor>(`${this.apiUrl}/crear`, autor, { headers });
  }
  // Actualizar autor
  actualizarAutor(id: number, autor: Autor): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Autor>(`${this.apiUrl}/actualizar/${id}`, autor, { headers });
  }
  
}

