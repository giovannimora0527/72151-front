import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrestamoService } from './service/prestamo.service';
import { UsuarioService } from '../usuario/service/usuario.service';
import { LibrosService } from '../libro/service/libro.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import { Prestamo } from 'src/app/models/prestamo';
import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';
import { PrestamoRq } from 'src/app/models/prestamoRq';
import { PrestamoActualizarRq } from 'src/app/models/prestamoActualizarRq';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.scss']
})
export class PrestamosComponent {
  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  librosDisponibles: Libro[] = [];
  prestamoSelected: Prestamo | null = null; // Cambié el tipo a null en lugar de undefined.

  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  // Formularios separados
  formCrear: FormGroup;
  formEditar: FormGroup;

  constructor(
    private prestamoService: PrestamoService,
    private usuarioService: UsuarioService,
    private libroService: LibrosService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils
  ) {
    this.formCrear = this.formBuilder.group({
      idUsuario: ['', Validators.required],
      idLibro: ['', Validators.required],
      fechaDevolucion: ['', Validators.required],
    });

    this.formEditar = this.formBuilder.group({
      fechaEntrega: ['', Validators.required],
    });

    this.cargarListaPrestamos();
  }

  cargarListaPrestamos() {
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data.map(prestamo => ({
          ...prestamo,
          fechaDevolucion: prestamo.fechaDevolucion ? new Date(prestamo.fechaDevolucion) : null,
          fechaEntrega: prestamo.fechaEntrega ? new Date(prestamo.fechaEntrega) : null
        }));
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }
  
  cargarFormulario() {
    if (this.modoFormulario === 'C') {
      this.formCrear.reset();
      this.formCrear.markAsPristine();
      this.formCrear.markAsUntouched();
    } else if (this.modoFormulario === 'E') {
      this.formEditar.reset();
      this.formEditar.markAsPristine();
      this.formEditar.markAsUntouched();
    }
  }

  cargarDatosParaModal() {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });

    this.libroService.getLibros().subscribe(libros => {
      this.librosDisponibles = libros.filter(libro => libro.existencias > 0);
    });
  }

  crearPrestamoModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm === 'C' ? 'Crear Préstamo' : 'Actualizar Préstamo';

    this.cargarDatosParaModal();
    this.cargarFormulario(); // Cargar el formulario correspondiente

    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(prestamo: Prestamo) {
    this.prestamoSelected = prestamo;

    this.formEditar.patchValue({
      fechaEntrega: this.prestamoSelected.fechaEntrega,
    });

    this.crearPrestamoModal('E');
  }

  cerrarModal() {
    if (this.modoFormulario === 'C') {
      this.formCrear.reset();
    } else if (this.modoFormulario === 'E') {
      this.formEditar.reset();
    }

    if (this.modalInstance) {
      this.modalInstance.hide();
    }

    this.prestamoSelected = null; // Asegúrate de resetear la selección de préstamo.
  }

  guardarActualizarPrestamo() {
    if (this.modoFormulario === 'C' && this.formCrear.valid) {
      const formValue = this.formCrear.getRawValue();
      const prestamoRq: PrestamoRq = {
        idUsuario: +formValue.idUsuario,
        idLibro: +formValue.idLibro,
        fechaDevolucion: formValue.fechaDevolucion,
      };

      this.prestamoService.crearPrestamo(prestamoRq).subscribe({
        next: (data) => {
          this.cerrarModal();
          this.cargarListaPrestamos();
          this.messageUtils.showMessage('Éxito', data.message, 'success');
        },
        error: (error) => {
          this.messageUtils.showMessage('Error', error.error.message, 'error');
        }
      });
    } else if (this.modoFormulario === 'E' && this.formEditar.valid) {
      const fechaEntrega = this.formEditar.value.fechaEntrega;

      const actualizarPrestamo: PrestamoActualizarRq = {
        idPrestamo: this.prestamoSelected?.idPrestamo!, // Añadí la comprobación para nullability.
        fechaEntrega: fechaEntrega
      };

      this.prestamoService.actualizarPrestamo(actualizarPrestamo).subscribe({
        next: (data) => {
          this.cerrarModal();
          this.cargarListaPrestamos();
          this.messageUtils.showMessage('Éxito', data.message, 'success');
        },
        error: (error) => {
          this.messageUtils.showMessage('Error', error.error.message, 'error');
        }
      });
    }
  }
}
