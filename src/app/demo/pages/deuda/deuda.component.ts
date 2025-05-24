/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
import { Deuda, EstadoPago, MetodoPago } from 'src/app/models/deuda';
import { DeudaService } from './service/deuda.service';
import { UsuarioService } from '../usuario/service/usuario.service';
import { PrestamoService } from '../prestamo/service/prestamo.service';
import { Prestamo } from 'src/app/models/prestamo';
import { Usuario } from 'src/app/models/usuario';

// Bootstrap modal
declare const bootstrap: any;

@Component({
  selector: 'app-deuda',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './deuda.component.html',
  styleUrls: ['./deuda.component.scss']
})
export class DeudaComponent {
  modalInstance: any;
  titleModal: string = '';
  modoFormulario: string = '';

  deudas: Deuda[] = [];
  deudasOriginales: Deuda[] = []; // Para mantener copia original al filtrar
  deudaSelected: Deuda;

  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];

  // Formulario para crear/editar deuda
  form: FormGroup = new FormGroup({
    idDeuda: new FormControl(''),
    idPrestamo: new FormControl('', Validators.required),
    idUsuario: new FormControl('', Validators.required),
    valorDeuda: new FormControl('', [Validators.required, Validators.min(1)]),
    estadoPago: new FormControl('', Validators.required),
    metodoPago: new FormControl(''),
    fechaPago: new FormControl(''),
    fechaGeneracion: new FormControl('', Validators.required),
    fechaLimitePago: new FormControl('', Validators.required),
    estado: new FormControl(true)
  });

  // Formulario para búsqueda
  searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl('')
  });

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly formBuilder: FormBuilder,
    private readonly deudaService: DeudaService,
    private readonly prestamoService: PrestamoService,
    private readonly usuarioService: UsuarioService
  ) {
    this.cargarDeudas();
    this.cargarPrestamos();
    this.cargarUsuarios();
  }

  cargarDeudas() {
    this.deudaService.listarDeudas().subscribe({
      next: (data: Deuda[]) => {
        this.deudas = data;
        this.deudasOriginales = data; // Guardar copia original
      },
      error: (error) => {
        console.error('Error cargando deudas', error);
      }
    });
  }
getLibroDeDeuda(deuda: Deuda): string {
  if (!deuda.prestamo?.libro) return 'Sin libro asociado';
  return deuda.prestamo.libro.titulo || `Libro ID: ${deuda.prestamo.libro.idLibro}`;
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

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearModal');
    modalElement?.blur();
    modalElement?.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm === 'C' ? 'Crear Deuda' : 'Actualizar Deuda';
    if (modalElement) {
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(deuda: Deuda) {
    this.deudaSelected = deuda;

    // Cerrar modal crearModal si está abierto
    const crearModalEl = document.getElementById('crearModal');
    if (crearModalEl) {
      const modalCrearInstance = bootstrap.Modal.getInstance(crearModalEl);
      if (modalCrearInstance) {
        modalCrearInstance.hide();
      }
    }

    // Abrir modalPago
    const modalPagoEl = document.getElementById('modalPago');
    if (modalPagoEl) {
      let modalPagoInstance = bootstrap.Modal.getInstance(modalPagoEl);
      if (!modalPagoInstance) {
        modalPagoInstance = new bootstrap.Modal(modalPagoEl);
      }
      modalPagoInstance.show();
    }
  }

 cerrarModal() {
  const modalElement = document.getElementById('modalPago');
  if (modalElement) {
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
  this.deudaSelected = null;
}

  // Agrega esta propiedad
prestamoParaDeuda: Prestamo | null = null;
abrirModalCrearDeuda() {
  const modalElement = document.getElementById('modalCrearDeuda');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
}
// Método para generar deuda automática
generarDeudaAutomatica() {
  if (!this.prestamoParaDeuda) {
    this.messageUtils.showMessage("Advertencia", "Debe seleccionar un préstamo", "warning");
    return;
  }

  // Crear objeto Deuda mínimo con solo el idPrestamo
  const deudaMinima: any = {
    idPrestamo: this.prestamoParaDeuda.idPrestamo,
    // El backend completará los demás campos
    valorDeuda: 0, // Valor temporal, el backend lo calculará
    estadoPago: 'NO_CANCELADO' // Valor temporal
  };

  this.deudaService.crearDeuda(deudaMinima).subscribe({
    next: (response) => {
      this.messageUtils.showMessage("Éxito", "Deuda generada correctamente", "success");
      this.cargarDeudas();
      this.cerrarModalCrearDeuda();
    },
    error: (error) => {
      console.error('Error generando deuda:', error);
      this.messageUtils.showMessage("Error", error.error?.message || "Error al generar la deuda", "error");
    }
  });
}
cerrarModalCrearDeuda() {
  this.prestamoParaDeuda = null;
  const modalElement = document.getElementById('modalCrearDeuda');
  if (modalElement) {
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}

  guardarActualizar() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const idUsuario = +formValue.idUsuario;
      const idPrestamo = +formValue.idPrestamo;

      if (isNaN(idUsuario) || isNaN(idPrestamo)) {
        this.messageUtils.showMessage("Advertencia", "Debe seleccionar un préstamo y un usuario válidos", "warning");
        return;
      }

      const payload: any = {
        usuario: { idUsuario },
        prestamo: { idPrestamo },
        valorDeuda: formValue.valorDeuda,
        estadoPago: formValue.estadoPago,
        metodoPago: formValue.metodoPago,
        fechaPago: formValue.fechaPago,
        fechaGeneracion: formValue.fechaGeneracion,
        fechaLimitePago: formValue.fechaLimitePago,
        estado: formValue.estado
      };

      if (this.modoFormulario === 'E') {
        payload.idDeuda = +formValue.idDeuda;
        this.deudaService.actualizarDeuda(payload).subscribe({
          next: () => {
            this.messageUtils.showMessage("Éxito", "Deuda actualizada correctamente", "success");
            this.cerrarModal();
            this.cargarDeudas();
          },
          error: (error) => {
            console.error('Error en actualización:', error);
            this.messageUtils.showMessage("Error", error.error.message || "Error al actualizar la deuda", "error");
          }
        });
      } else {
        this.deudaService.crearDeuda(payload).subscribe({
          next: () => {
            this.messageUtils.showMessage("Éxito", "Deuda creada correctamente", "success");
            this.cerrarModal();
            this.cargarDeudas();
          },
          error: (error) => {
            console.error('Error en creación:', error);
            this.messageUtils.showMessage("Error", error.error.message || "Error al crear la deuda", "error");
          }
        });
      }
    } else {
      this.messageUtils.showMessage("Advertencia", "El formulario no es válido", "warning");
    }
  }

  getNombreUsuario(idUsuario: number): string {
    const usuario = this.usuarios.find(u => u.idUsuario === idUsuario);
    return usuario ? `${usuario.nombre}` : 'Desconocido';
  }

  getNombrePrestamo(idPrestamo: number): string {
    const prestamo = this.prestamos.find(p => p.idPrestamo === idPrestamo);
    return prestamo ? prestamo.usuario.nombre : 'Desconocido';
  }

  // Filtrar las deudas según término de búsqueda (nombre usuario, fecha de préstamo, fecha de devolución)
  buscar() {
  const term = this.searchForm.get('searchTerm')?.value?.toString().toLowerCase() || '';

  if (!term) {
    this.deudas = [...this.deudasOriginales];
    return;
  }

  this.deudas = this.deudasOriginales.filter(deuda => {
    const usuario = this.usuarios.find(u => u.idUsuario === deuda.usuario?.idUsuario);
    const nombreUsuario = usuario?.nombre.toLowerCase() || '';
    
    // Convertir el valor de la deuda a string para buscar coincidencias
    const valorDeudaStr = deuda.valorDeuda.toString().toLowerCase();
    
    // Fechas como string yyyy-MM-dd para comparación simple
    const fechaGeneracion = deuda.fechaGeneracion ? new Date(deuda.fechaGeneracion).toISOString().slice(0, 10) : '';
    const fechaPago = deuda.fechaPago ? new Date(deuda.fechaPago).toISOString().slice(0, 10) : '';

    return (
      nombreUsuario.includes(term) ||
      valorDeudaStr.includes(term) ||  // Nueva condición para buscar por valor
      fechaGeneracion.includes(term) ||
      fechaPago.includes(term)
    );
  });
}
pagoRealizado: boolean = false;
  // Agrega este método en tu componente
pagarDeuda() {
  if (!this.deudaSelected?.metodoPago) {
    this.messageUtils.showMessage("Advertencia", "Debe seleccionar un método de pago", "warning");
    return;
  }

  const payload = {
    idDeuda: this.deudaSelected.idDeuda,
    metodoPago: this.deudaSelected.metodoPago,
    fechaPago: new Date().toISOString(), // Fecha actual
    estadoPago: 'CANCELADO' // Cambiar estado a CANCELADO
  };

  this.deudaService.actualizarDeuda(payload).subscribe({
    next: () => {
      this.messageUtils.showMessage("Éxito", "Pago registrado correctamente", "success");
      this.cerrarModal();
      this.cargarDeudas(); // Recargar la lista de deudas
    },
    error: (error) => {
      console.error('Error registrando pago:', error);
      this.messageUtils.showMessage("Error", error.error?.message || "Error al registrar el pago", "error");
    }
  });
   // Al finalizar el pago:
    this.pagoRealizado = true;

    // Cierra el modal
    const modalElement = document.getElementById('modalPago');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();

    // Limpia después de cerrar
    setTimeout(() => {
      this.pagoRealizado = false;
      this.deudaSelected = null;
    }, 500); // permite que el modal cierre antes de limpiar
}
}
