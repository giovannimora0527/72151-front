import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageUtils } from 'src/app/utils/message-utils';
import { Libro } from 'src/app/models/libro';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  Validators
} from '@angular/forms';
import { LibrosService } from './service/libro.service';
import { AutorService } from '../autor/service/autor.service';
import { Autor } from 'src/app/models/autor';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';

declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true, // Asegurar que el componente sea independiente
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.scss']
})
export class LibroComponent {
  // Variables para almacenar la data obtenida del backend
  libros: Libro[] = [];
  autores: Autor[] = [];
  categorias: Categoria[] = [];

  // Variable para el libro seleccionado en modo edición
  libroSelected: Libro | null = null;

  // Variables para el manejo del modal
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  // Formulario reactivo
  form: FormGroup;

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly formBuilder: FormBuilder,
    private readonly libroService: LibrosService,
    private readonly autorService: AutorService,
    private readonly categoriaService: CategoriaService
  ) {
    this.cargarLibros();
    this.cargarFormulario();
    this.cargarAutores();
    this.cargarCategorias();
  }

  // Configuración del formulario usando FormBuilder y validaciones
  cargarFormulario(): void {
    this.form = this.formBuilder.group({
      titulo: ['', Validators.required],
      anioPublicacion: ['', Validators.required],
      autorId: ['', Validators.required],
      categoriaId: ['', Validators.required],
      existencias: ['', Validators.required]
    });
  }

  // Getter para acceder a los controles del formulario
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // Método para cargar la lista de libros desde el servicio
  cargarLibros(): void {
    this.libroService.getLibros().subscribe({
      next: (data) => {
        console.log(data);
        this.libros = data;
      },
      error: (error) => console.log(error)
    });
  }

  // Método para cargar la lista de autores
  cargarAutores(): void {
    this.autorService.listarAutores().subscribe({
      next: (data) => {
        console.log(data);
        this.autores = data;
      },
      error: (error) => console.log(error)
    });
  }

  // Método para cargar la lista de categorías
  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        console.log(data);
        this.categorias = data;
      },
      error: (error) => console.log(error)
    });
  }

  // Método para crear (mostrar) el modal. Si el modal ya existe, se reutiliza
  crearModal(modoForm: string): void {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearModal');
    this.titleModal = modoForm === 'C' ? 'Crear Libro' : 'Actualizar Libro';

    if (modalElement) {
      // Si aún no se ha creado la instancia del modal, se inicializa
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
      }
      modalElement.removeAttribute('aria-hidden'); // Asegurarse de que no esté bloqueado
      this.modalInstance.show();
    } else {
      console.error('No se encontró el modal en el DOM.');
    }
  }

  abrirModoEdicion(libro: Libro) {
    this.libroSelected = libro;
    this.form.patchValue({
      titulo: libro.titulo,
      anioPublicacion: libro.anioPublicacion,
      autorId: libro.autor?.autorId,
      categoriaId: libro.categoria?.categoriaId,
      existencias: libro.existencias
    });
    this.crearModal('E'); // Mostrar el modal
  }

  // Método para cerrar el modal y reiniciar el formulario
  cerrarModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance = null;
    }
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();

    const modalElement = document.getElementById('crearModal');
    if (modalElement) {
      modalElement.setAttribute('aria-hidden', 'true');
    }
    this.libroSelected = null;
  }

  // Método para guardar los datos del formulario, ya sea creando o actualizando un libro
  guardarActualizar(): void {
    console.log(this.form.getRawValue());
    if (this.form.valid) {
      if (this.modoFormulario === 'C') {
        // Crear un nuevo libro
        const libroRq = {
          titulo: this.form.value.titulo,
          anioPublicacion: this.form.value.anioPublicacion,
          autorId: this.form.value.autorId,
          categoriaId: this.form.value.categoriaId,
          existencias: this.form.value.existencias
        };

        this.libroService.crearLibro(libroRq).subscribe({
          next: (data) => {
            console.log('Libro creado:', data.message);
            this.cargarLibros();
            this.cerrarModal();
            this.messageUtils.showMessage("Éxito", data.message, "success");
          },
          error: (error) => {
            console.log('Error al crear libro:', error);
            this.messageUtils.showMessage('Error', error.error.message, 'error');
          }
        });
      } else if (this.modoFormulario === 'E') {
        // Actualizar un libro existente
        const libroRq = {
          id: this.libroSelected?.idLibro,
          titulo: this.form.value.titulo,
          anioPublicacion: this.form.value.anioPublicacion,
          autorId: this.form.value.autorId,
          categoriaId: this.form.value.categoriaId,
          existencias: this.form.value.existencias
        };

        this.libroService.actualizarLibro(libroRq).subscribe({
          next: (data) => {
            console.log('Libro actualizado:', data.message);
            this.cargarLibros();
            this.cerrarModal();
            this.messageUtils.showMessage("Éxito", data.message, "success");
          },
          error: (error) => {
            console.log('Error al actualizar libro:', error);
            this.messageUtils.showMessage('Error', error.error.message, 'error');
          }
        });
      }
    }
  }
}