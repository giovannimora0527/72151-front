/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import { MessageUtils } from 'src/app/utils/message-utils';

declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  autorSelected: Autor | null = null;

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
    this.cargarFormulario();
    this.cargarListaAutores();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      nacionalidad: [''],
      fechaNacimiento: ['']
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.autorService.listarAutores().subscribe({
      next: (data) => {
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
    if (modalElement) {
      this.titleModal = modoForm === 'C' ? 'Crear Autor' : 'Actualizar Autor';
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
      nombre: autor.nombre,
      nacionalidad: autor.nacionalidad,
      fechaNacimiento: autor.fechaNacimiento ? autor.fechaNacimiento.toString().split('T')[0] : ''
    });
    this.crearAutorModal('E');
  }

  guardarActualizarAutor() {
    if (this.form.valid) {
      const autorData: Autor = {
        autorId: this.autorSelected?.autorId || 0,
        ...this.form.getRawValue()
      };

      if (this.modoFormulario === 'C') {
        this.autorService.crearAutor(autorData).subscribe({
          next: (data) => {
            this.cerrarModal();
            this.cargarListaAutores();
            this.messageUtils.showMessage('Éxito', data.message, 'success');
          },
          error: (error) => {
            this.messageUtils.showMessage('Error', error.error.message, 'error');
          }
        });
      } else {
        this.autorService.actualizarAutor(autorData).subscribe({
          next: (data) => {
            this.cerrarModal();
            this.cargarListaAutores();
            this.messageUtils.showMessage('Éxito', data.message, 'success');
          },
          error: (error) => {
            this.messageUtils.showMessage('Error', error.error.message, 'error');
          }
        });
      }
    }
  }
}
