import { Component } from '@angular/core';
import { Autor } from 'src/app/models/autor';
import { AutorService } from './service/autor.service';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any;


@Component({
  selector: 'app-autor',
  imports: [CommonModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})


export class AutorComponent {
  autores: Autor[] = [];
  modalInstance: any;

  form: FormGroup = new FormGroup({
    nombreAutor: new FormControl(''),
    nacionalidad: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder
  ) {
    this.cargarListaAutores();
    this.cargarFormulario();
  }

  cargarFormulario(){
    this.form = this.formBuilder.group({
      nombreAutor: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  cargarListaAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        console.log(data);
        this.autores = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  cargarAutorModal(){
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) { 
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    } 
  }

  crearAutorModal(){
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  cerrarModal(){
    this.form.reset();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
}


