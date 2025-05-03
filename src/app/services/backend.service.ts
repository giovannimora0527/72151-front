import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) { }

  // Función para construir los headers con el token
  private construirHeader() {
    const tokenRecuperado = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });
    return headers;
  }

  // Método GET actualizado para aceptar URL completa
  get<T>(url: string, routerParams?: HttpParams): Observable<T> {
    const headers = this.construirHeader();
    return this.http.get<T>(url, {
      params: routerParams,
      headers: headers,
      withCredentials: true,
    });
  }

  // Método POST actualizado para aceptar URL completa
  post<T>(url: string, data: any): Observable<T> {
    const headers = this.construirHeader();
    return this.http.post<T>(url, data, {
      headers: headers,
      withCredentials: true,
    });
  }

  // Método PUT actualizado para aceptar URL completa
  put<T>(url: string, data: any): Observable<T> {
    const headers = this.construirHeader();
    return this.http.put<T>(url, data, {
      headers: headers,
    });
  }

  // Método POST para enviar archivos actualizado
  postFile<T>(url: string, data: any): Observable<T> {
    const tokenRecuperado = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      mimeType: 'multipart/form-data',
      Authorization: tokenRecuperado ? `Bearer ${tokenRecuperado}` : '',
    });
    return this.http.post<T>(url, data, {
      headers: headers,
      withCredentials: true,
    });
  }
}