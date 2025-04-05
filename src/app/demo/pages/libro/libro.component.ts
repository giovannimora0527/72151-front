/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { LibroService } from './service/libro.service';
import { Libro } from 'src/app/models/libro';
import { libroRq } from 'src/app/models/libroRq';
import { MessageUtils } from 'src/app/utils/message-utils';
declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.scss']
})
export class LibroComponent implements OnInit {
  libros: Libro[] = [];
  modalInstance: any;
  modoFormulario: 'C' | 'E' = 'C';
  titleModal = '';
  libroSelected!: Libro;

  form: FormGroup;

  constructor(
    private libroService: LibroService,
    private fb: FormBuilder,
    private messageUtils: MessageUtils
  ) {
    // Inicializa el formulario con validaciones
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      anioPublicacion: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      categoria: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    this.cargarListaLibros();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaLibros() {
    this.libroService.getLibros().subscribe({
      next: (data: Libro[]) => {
        this.libros = data;
      },
      error: (err) => {
        this.messageUtils.showMessage(
          'Error',
          err.error?.message ?? 'Error al cargar libros',
          'error'
        );
      }
    });
  }

  crearLibroModal(modo: 'C' | 'E') {
    this.modoFormulario = modo;
    this.titleModal = modo === 'C' ? 'Crear Libro' : 'Actualizar Libro';

    const modalEl = document.getElementById('crearLibroModal');
    if (modalEl) {
      this.modalInstance = this.modalInstance || new bootstrap.Modal(modalEl);
      this.modalInstance.show();
    }
  }

  cerrarModal() {
    this.form.reset({
      titulo: '',
      anioPublicacion: '',
      categoria: ''
    });
    this.modalInstance?.hide();
  }

  abrirModoEdicion(libro: Libro) {
    this.libroSelected = libro;
    this.form.patchValue({
      titulo: libro.titulo,
      anioPublicacion: libro.anioPublicacion,
      categoria: libro.categoria
    });
    this.crearLibroModal('E');
  }

  guardarActualizarLibro() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: libroRq = this.form.value;

    if (this.modoFormulario === 'C') {
      this.libroService.crearLibro(payload).subscribe({
        next: (res) => {
          this.messageUtils.showMessage('Éxito', res.message, 'success');
          this.cerrarModal();
          this.cargarListaLibros();
        },
        error: (err) =>
          this.messageUtils.showMessage(
            'Error',
            err.error?.message ?? 'Error al crear libro',
            'error'
          )
      });
    } else {
      this.libroService
        .actualizarLibro(this.libroSelected.idLibro, payload)
        .subscribe({
          next: (res) => {
            this.messageUtils.showMessage('Éxito', res.message, 'success');
            this.cerrarModal();
            this.cargarListaLibros();
          },
          error: (err) =>
            this.messageUtils.showMessage(
              'Error',
              err.error?.message ?? 'Error al actualizar libro',
              'error'
            )
        });
    }
  }
}