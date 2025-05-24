import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-user-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Cargar Usuarios desde Archivo</h2>
      <input type="file" (change)="onFileSelected($event)" accept=".csv, .txt">
      <br><br>
      <button [disabled]="!selectedFile" (click)="uploadFile()">Cargar Usuarios</button>
      <p *ngIf="selectedFile">Archivo seleccionado: {{ selectedFile.name }}</p>
      <p *ngIf="uploadProgress > 0">Progreso de carga: {{ uploadProgress }}%</p>
      <p *ngIf="uploadResponse">{{ uploadResponse }}</p>
      <p *ngIf="uploadError" style="color: red;">Error al cargar: {{ uploadError }}</p>
    </div>
  `
})
export class UserUploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadResponse: string = '';
  uploadError: string = '';
  apiUrl = 'http://localhost:8000/biblioteca/v1/usuario/cargar-usuarios';

  constructor(private http: HttpClient, private router: Router) { } // Inyecta el Router

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.uploadProgress = 0;
    this.uploadResponse = '';
    this.uploadError = '';
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        this.http.post(this.apiUrl, fileContent, {
          headers: { 'Content-Type': 'text/plain' }
        }).subscribe({
          next: (response: any) => {
            this.uploadResponse = response;
            Swal.fire('Éxito', response, 'success').then(() => {
              window.location.reload();
            });
            this.resetComponent();
          },
          error: (error) => {
            this.uploadError = error.error.message || 'Error al cargar el archivo.';
            Swal.fire('Error', this.uploadError, 'error').then(() => {
                window.location.reload();
              });
            this.resetComponent();
          }
        });
      };
      reader.onerror = () => {
        this.uploadError = 'Error al leer el archivo.';
        Swal.fire('Error', this.uploadError, 'error');
        this.resetComponent();
      };
      reader.readAsText(this.selectedFile);
    }
  }

  resetComponent(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.uploadResponse = '';
    this.uploadError = '';
  }
}