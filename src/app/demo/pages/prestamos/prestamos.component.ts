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
import { PrestamoService } from './services/prestamo.service';
import { UsuarioService } from '../usuario/service/usuario.service';
import { LibrosService } from '../libros/services/libros.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import { Prestamo } from 'src/app/models/prestamo/prestamo';
import { Usuario } from 'src/app/models/usuario/usuario';
import { Libro } from 'src/app/models/libro/libro';
import { PrestamoRq } from 'src/app/models/prestamo/prestamoRq';
import { PrestamoActualizarRq } from 'src/app/models/prestamo/prestamoActualizarRq';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss']
})
export class PrestamosComponent {
  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  librosDisponibles: Libro[] = [];
  prestamoSelected: Prestamo;

  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  // Formularios separados
  formCrear: FormGroup = new FormGroup({
    idUsuario: new FormControl('', Validators.required),
    idLibro: new FormControl('', Validators.required),
    fechaDevolucion: new FormControl('', Validators.required),
  });

  formEditar: FormGroup = new FormGroup({
    fechaEntrega: new FormControl('', Validators.required), 
  });

  constructor(
    private prestamoService: PrestamoService,
    private usuarioService: UsuarioService,
    private librosService: LibrosService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils
  ) {
    this.cargarListaPrestamos();
    this.cargarFormulario();
  }

  cargarFormulario() {
    // Solo cargamos los formularios cuando se cambia el modo
    if (this.modoFormulario === 'C') {
      this.formCrear = this.formBuilder.group({
        idUsuario: ['', Validators.required],
        idLibro: ['', Validators.required],
        fechaDevolucion: ['', Validators.required],
      });
    } else if (this.modoFormulario === 'E') {
      this.formEditar = this.formBuilder.group({
        fechaEntrega: ['', Validators.required], // Solo para la edición
      });
    }
  }

  cargarListaPrestamos() {
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  cargarDatosParaModal() {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });

    this.librosService.getLibrosDiponibles().subscribe(libros => {
      this.librosDisponibles = libros;
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
      this.formCrear.markAsPristine();
      this.formCrear.markAsUntouched();
      this.formCrear.reset();
    } else if (this.modoFormulario === 'E') {
      this.formEditar.reset();
      this.formEditar.markAsPristine();
      this.formEditar.markAsUntouched();
      this.formEditar.reset({
        fechaEntrega: '',
      }
      );
    }
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.prestamoSelected = null;
    console.log(this.prestamoSelected);
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
    } else if (this.formEditar.valid) {
      console.log('Entro a editar');
      const fechaEntrega = this.formEditar.value.fechaEntrega;

      const actualizarPrestamo: PrestamoActualizarRq = {
        idPrestamo: this.prestamoSelected.idPrestamo,
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
