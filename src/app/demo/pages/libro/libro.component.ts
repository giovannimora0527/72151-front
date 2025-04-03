// ** Angular Imports

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroService } from './service/libro.service';
import { Libro } from 'src/app/models/libro';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-libro',
  imports: [CommonModule],
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.scss']
})
export class LibroComponent {
  libros: Libro[] = [];
  modalInstance: any;

  form: FormGroup = new FormGroup({
    nombreLibro: new FormControl(''),
    autor: new FormControl(''),
    anioPublicacion: new FormControl(''),
    categoria: new FormControl(''),
    existencias: new FormControl('')
  });

  constructor(
    private libroService: LibroService,
    private formBuilder: FormBuilder
  ) {
    this.cargarListaLibros();
    this.cargarFormulario();
  }

  cargarFormulario(){
    this.form = this.formBuilder.group({
      nombreLibro: ['', [Validators.required]],
      autor: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      existencias: ['', [Validators.required]]
    });
  }

  cargarListaLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => {
        console.log(data);
        this.libros = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  crearLibroModal(){
    const modalElement = document.getElementById('crearLibroModal');
    if (modalElement) { 
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  cerrarModal(){ 
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  } 
}

