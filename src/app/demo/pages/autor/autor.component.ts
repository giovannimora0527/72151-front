/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorService } from './service/autor.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
import { Autor } from 'src/app/models/autor';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

  @Component({
    selector: 'app-autor',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule
    ],
    templateUrl: './autor.component.html',
    styleUrls: ['./autor.component.scss']
  })
  
export class AutorComponent {
autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = "";

  autorSelected: Autor;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidad: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    
  });

  constructor(
    private readonly autorService: AutorService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils
  ) {
    this.cargarListaAutores();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      activo: [true]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.autorService.listarAutores().subscribe({
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
      nacionalidad: "",
      fechaNacimiento: "",
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
      nacionalidad: this.autorSelected.nacionalidad,
      fechaNacimiento: this.autorSelected.fechaNacimiento,
    });
    this.crearAutorModal('E');
    console.log(this.autorSelected);
  }

  guardarActualizarAutor() {
    console.log('Entro');
    console.log(this.form.valid);
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
    }
    if (this.form.valid) {
      console.log(this.form.getRawValue());
      console.log('El formualario es valido');     
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un usuario nuevo');
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
        const idUsuario = this.autorSelected.autorId;
        this.autorSelected = {
          idUsuario: idUsuario,
          ...this.form.getRawValue()
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
}

