/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageUtils } from 'src/app/utils/message-utils';
import { Prestamo } from 'src/app/models/prestamo';
import { FormGroup, FormControl, FormBuilder, FormsModule, ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
import { PrestamoService } from './service/prestamo.service';
import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';
import { UsuarioService } from '../usuario/service/usuario.service';
import { LibroService } from '../libro/service/libro.service';

// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;
@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.scss']
})
export class PrestamoComponent {
  modalInstance: any;
  titleModal: string = '';
  modoFormulario: string = '';
  prestamos: Prestamo[] = [];
  prestamoSelected: Prestamo;

  usuarios: Usuario[] = [];
  libros: Libro[] = [];

  form: FormGroup = new FormGroup({
    idPrestamo: new FormControl(''),  // Añadido para capturar el ID del préstamo
    idUsuario: new FormControl('', Validators.required),
    idLibro: new FormControl('', Validators.required),
    fechaDevolucion: new FormControl('', Validators.required),
    fechaEntrega: new FormControl('')

  });

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly formBuilder: FormBuilder,
    private readonly prestamoService: PrestamoService,
    private readonly usuarioService: UsuarioService,
    private readonly libroService: LibroService
  ) {
    this.cargarPrestamos();
    this.cargarUsuarios();
    this.cargarLibros();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error cargando usuarios', error);
      }
    });
  }

  cargarLibros() {
    this.libroService.getLibros().subscribe({
      next: (data: Libro[]) => {
        this.libros = data.filter(libro => libro.existencias > 0);
      },
      error: (error) => {
        console.error('Error cargando libros', error);
      }
    });
  }

  cargarPrestamos() {
    this.prestamoService.listarPrestamos().subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data;
      },
      error: (error) => {
        console.error('Error cargando préstamos', error);
      }
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearModal');
    modalElement?.blur();
    modalElement?.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm === 'C' ? 'Crear Préstamo' : 'Actualizar Préstamo';
    if (modalElement) {
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(prestamo: Prestamo) {
  this.prestamoSelected = prestamo;

  this.form.patchValue({
    idPrestamo: prestamo.idPrestamo,
    idUsuario: prestamo.usuario?.idUsuario,
    idLibro: prestamo.libro?.idLibro,
    fechaDevolucion: prestamo.fechaDevolucion,
    fechaEntrega: prestamo.fechaEntrega
  });

  this.crearModal('E');
}
  

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.prestamoSelected = null;
  }

  guardarActualizar() {
    console.log(' Modo de formulario:', this.modoFormulario);
    console.log(' Datos del formulario:', this.form.value);

    if (this.form.valid) {
      const formValue = this.form.getRawValue();

      const idUsuario = +formValue.idUsuario;
      const idLibro = +formValue.idLibro;

      if (isNaN(idUsuario) || isNaN(idLibro)) {
        this.messageUtils.showMessage("Advertencia", "Debe seleccionar un usuario y un libro válidos", "warning");
        return;
      }

      let prestamoPayload: any;

      if (this.modoFormulario === 'E') {
        prestamoPayload = {
          idPrestamo: +formValue.idPrestamo,
          usuario: { idUsuario },
          libro: { idLibro },
          fechaDevolucion: formValue.fechaDevolucion,
          estado: this.prestamoSelected?.estado || 'PRESTADO'
        };

        if (formValue.fechaEntrega) {
          const fechaEntrega = new Date(formValue.fechaEntrega);
          const fechaDevolucionDate = new Date(formValue.fechaDevolucion);
        
          // Aseguramos que se agregue la fecha de entrega al payload
          prestamoPayload.fechaEntrega = fechaEntrega.toISOString().split('.')[0];
        
          // Verificación y cambio de estado según la comparación
          if (fechaEntrega > fechaDevolucionDate) {
            prestamoPayload.estado = 'VENCIDO';
          } else {
            prestamoPayload.estado = 'DEVUELTO';
          }
        
          console.log(" Fecha Entrega:", fechaEntrega);
          console.log(" Fecha Devolución:", fechaDevolucionDate);
          console.log(" Estado asignado:", prestamoPayload.estado);
        }

        console.log(" Payload de actualización:", prestamoPayload);

        this.prestamoService.actualizarPrestamo(prestamoPayload).subscribe({
          next: () => {
            this.messageUtils.showMessage("Éxito", "Préstamo actualizado correctamente", "success");
            this.cerrarModal();
            this.cargarPrestamos();
          },
          error: (error) => {
            console.error(' Error en actualización:', error);
            this.messageUtils.showMessage("Error", error.error.message || "Error al actualizar el préstamo", "error");
          }
        });

      } else {
        // Modo creación
        prestamoPayload = {
          idUsuario,
          idLibro,
          fechaDevolucion: formValue.fechaDevolucion,
          estado: this.prestamoSelected?.estado || 'PRESTADO'
        };

        console.log(" Payload de creación:", prestamoPayload);

        this.prestamoService.crearPrestamo(prestamoPayload).subscribe({
          next: () => {
            this.messageUtils.showMessage("Éxito", "Préstamo creado correctamente", "success");
            this.cerrarModal();
            this.cargarPrestamos();
          },
          error: (error) => {
            console.error(' Error en creación:', error);
            this.messageUtils.showMessage("Error", error.error.message || "Error al crear el préstamo", "error");
          }
        });
      }

    } else {
      console.warn(' Errores de validación:', this.form.errors);
      this.messageUtils.showMessage("Advertencia", "El formulario no es válido", "warning");
    }
  }

}  

