/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { AutorService } from './service/autor.service';

import { CommonModule } from '@angular/common';
import { Autor } from 'src/app/models/autor';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';

import { NacionalidadService } from 'src/app/services/nacionalidad.service';
import { Nacionalidad } from 'src/app/models/nacionalidad';

// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = "";

  autorSelected: Autor;

  nacionalidades: Nacionalidad[] = [];

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidadId: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils,
    private nacionalidadService: NacionalidadService
  ) {
    this.cargarListaAutores();
    this.cargarNacionalidades();
    this.cargarFormulario();
  }

  cargarNacionalidades(){
    this.nacionalidadService.getNacionalidades().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.nacionalidades = data;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidadId: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      activo: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        console.log(data);
        this.autores = data;
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearAutorModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm == "C"? "Crear Autor": "Actualizar Autor";
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  cerrarModal() { 
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      nombre: "",
      nacionalidadId: "",
      fechaNacimiento: "",
      activo: ""
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.autorSelected = null;
  }

  abrirModoEdicion(autor: Autor) {
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: this.autorSelected.nombre,
      nacionalidadId: this.autorSelected.nacionalidad.nacionalidadId,
      fechaNacimiento: this.autorSelected.fechaNacimiento, // Esta bien??? **********
      activo: !!this.autorSelected.activo  // asegura que sea booleano
    });
    console.log(this.form);
    console.log(this.autorSelected);
    this.crearAutorModal('E');
    console.log(this.autorSelected);
  }

  guardarActualizarAutor() {
    console.log('Entro');
    console.log(this.form.valid);
    if (this.form.valid) {
      console.log(this.form.getRawValue());
      console.log('El formulario es valido');     
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un autor nuevo');
        this.autorService.crearAutor(this.form.getRawValue())
        .subscribe(
          {
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarListaAutores();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          }
        );
      } else {
        console.log('Actualizamos un autor existente');
        const autorId = this.autorSelected.autorId;
        
        const nacionalidadId = this.form.get('nacionalidadId')?.value;
        const nacionalidadSeleccionada = this.nacionalidades.find(n => n.nacionalidadId == nacionalidadId);

        this.autorSelected = {
          ...this.autorSelected, // mantenemos las propiedades originales
          ...this.form.getRawValue(), // actualizamos solo con los datos del formulario
          nacionalidad: nacionalidadSeleccionada, // Actualizamos también el objeto completo
          autorId: autorId // aseguramos que autorId no cambie
        };  
        this.autorService.actualizarAutor(this.autorSelected)
        .subscribe(
          {
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarListaAutores();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          }
        );
      }
    }
  }



  // constructor(private autorService: AutorService) {
  //  this.autorService.test();
  // }
}
 