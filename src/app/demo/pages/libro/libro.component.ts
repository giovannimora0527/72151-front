/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageUtils } from 'src/app/utils/message-utils';
import { Libro } from 'src/app/models/libro';
import { FormGroup, FormControl, FormBuilder, FormsModule, ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
import { LibroService } from './service/libro.service';
import { AutorService } from '../autor/service/autor.service';
import { Autor } from 'src/app/models/autor';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent {
  modalInstance: any;
  titleModal: string = '';
  modoFormulario: string = '';
  libros: Libro[] = [];
  autores: Autor[] = [];
  libroSelected: Libro;

  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    anioPublicacion: new FormControl(''),
    autorId: new FormControl(''),
    categoria: new FormControl(''),
    existencias: new FormControl('')
  });

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly formBuilder: FormBuilder,
    private readonly libroService: LibroService,
    private readonly autorService: AutorService
  ) {
    this.cargarLibros();
    this.cargarFormulario();
    this.cargarAutores();
  }

  cargarAutores() {
    this.autorService.listarAutores().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.autores = data;
        },
        error: (error) => {
          console.log(error)
        }
      }
    );
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required]],
      autorId: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      existencias: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => {
        console.log(data);
        this.libros = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm == 'C' ? 'Crear Libro' : 'Actualizar Libro';
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(libro: Libro) {
    this.libroSelected = libro;
    this.form.patchValue({
      titulo: this.libroSelected.titulo,
      existencias: this.libroSelected.existencias,
      categoria: this.libroSelected.categoria,
      anioPublicacion: this.libroSelected.anioPublicacion,
      idAutor: this.libroSelected.autor.idAutor
    });
    this.crearModal('E');
    console.log(this.libroSelected);
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      titulo: '',
      anioPublicacion: '',
      exitencias: '',
      autorId: '',
      categoria: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.libroSelected = null;
  }
}
