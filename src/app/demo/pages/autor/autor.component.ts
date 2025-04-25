import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorService } from './service/autor.service';
import { Autor } from '/Users/samuelmartin/Documents/72151-front/src/app/models/autor';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
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

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidad: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
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
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
        console.log("Autores cargados:", this.autores);
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearAutorModal');
    this.titleModal = modoForm == "C"? "Crear Autor": "Actualizar Autor";
    if (modalElement) {
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
      fechaNacimiento: this.autorSelected.fechaNacimiento
    });
    this.crearAutorModal('E');
  }
  guardarActualizarAutor() {
    if (this.form.valid) {
      const autorActualizado = this.form.getRawValue(); // Solo campos editables
  
      if (this.modoFormulario.includes('C')) {
        this.autorService.crearAutor(autorActualizado).subscribe({
          next: (data) => {
            this.cerrarModal();
            this.cargarListaAutores();
            this.messageUtils.showMessage("Éxito", data.message, "success");
          },
          error: (error) => {
            this.messageUtils.showMessage("Error", error.error.message, "error");
          }
        });
      } else {
        // Asegurarse de que el ID no sea undefined
        if (!this.autorSelected?.idAutor) {
          this.messageUtils.showMessage("Error", "El ID del autor es inválido o no se ha cargado.", "error");
          return;
        }
  
        this.autorService.actualizarAutor(this.autorSelected.idAutor, autorActualizado).subscribe({
          next: (data) => {
            this.cerrarModal();
            this.cargarListaAutores();
            this.messageUtils.showMessage("Éxito", data.message, "success");
          },
          error: (error) => {
            this.messageUtils.showMessage("Error", error.error.message, "error");
          }
        });
      }
    }
  }
  
  }