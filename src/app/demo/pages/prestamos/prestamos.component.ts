// src/app/demo/pages/prestamos/prestamos.component.ts

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from 'src/app/models/libro';
import { Usuario } from 'src/app/models/usuario';
import { Prestamo } from 'src/app/models/prestamo';
import { prestamoRq } from 'src/app/models/prestamoRq';

import { FormGroup, FormControl, FormBuilder, FormsModule, ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
import { LibroService } from '../libro/service/libro.service';
import { UsuarioService } from '../usuario/service/usuario.service';
// **AJUSTE:** Importa correctamente el servicio de préstamos
import { prestamoService } from './service/prestamos.service';

import { Observable } from 'rxjs';
// **AJUSTE:** Importa correctamente el validador de fecha
import { minDateValidator } from 'src/app/utils/date.validators';

declare const bootstrap: any; // Para usar las funcionalidades de Bootstrap con el modal

@Component({
  selector: 'app-prestamo',
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Asegúrate que estos módulos estén importados aquí
  templateUrl: './prestamos.component.html',
  styleUrl: './prestamos.component.scss' // O styles si usas otro nombre
})
export class PrestamoComponent implements OnInit {

  @ViewChild('prestamoModal') prestamoModalElement!: ElementRef;
  modalInstance: any;

  titleModal: string = '';
  modoModal: 'crear' | 'editar' = 'crear';
  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  librosDisponibles: Libro[] = [];
  prestamoSelected: Prestamo | null = null;

  form: FormGroup;

  constructor(
    private messageUtils: MessageUtils,
    private formBuilder: FormBuilder,
    // **AJUSTE:** Asegúrate que estos servicios estén inyectados
    private libroService: LibroService,
    private usuarioService: UsuarioService,
    // **AJUSTE:** Asegúrate que este servicio esté inyectado
    private prestamoService: prestamoService
  ) {
    this.form = this.formBuilder.group({
      idUsuario: ['', []],
      idLibro: ['', []],
      // Los form controls almacenarán strings en formato "YYYY-MM-DDTHH:mm" desde los inputs datetime-local
      fechaDevolucion: ['', []],
      fechaEntrega: ['', []]
    });
  }

  ngOnInit(): void {
    this.cargarPrestamos();
    this.cargarUsuarios();
  }

  // Método helper para acceder a los controles del formulario fácilmente en el template (opcional)
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarPrestamos(): void {
    this.prestamoService.getPrestamos().subscribe({
      next: (data: Prestamo[]) => {
        this.prestamos = data;
      },
      error: (error) => {
        console.error('Error al cargar préstamos:', error);
        // Acceder a error.error.message si el backend envía ese formato
        const errorMessage = error.error?.message || "Error al cargar préstamos.";
        this.messageUtils.showMessage("Error", errorMessage, "error");
      }
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        // Acceder a error.error.message si el backend envía ese formato
        const errorMessage = error.error?.message || "Error al cargar usuarios.";
        this.messageUtils.showMessage("Error", errorMessage, "error");
      }
    });
  }

  cargarLibrosDisponibles(): void {
    this.libroService.getLibros().subscribe({
      next: (data: Libro[]) => {
        this.librosDisponibles = data;
      },
      error: (error) => {
        console.error('Error al cargar libros disponibles:', error);
        // Acceder a error.error.message si el backend envía ese formato
        const errorMessage = error.error?.message || "Error al cargar libros disponibles.";
        this.messageUtils.showMessage("Error", errorMessage, "error");
      }
    });
  }

  // **AJUSTE:** Método para confirmar y archivar préstamo
  confirmarArchivarPrestamo(prestamo: Prestamo): void {
    // Opcional: Mostrar un diálogo de confirmación (puedes usar confirm nativo o una librería como SweetAlert2)
    if (confirm(`¿Está seguro de que desea archivar el préstamo del libro "<span class="math-inline">\{prestamo\.libro?\.titulo\}" por "</span>{prestamo.usuario?.nombre}"?`)) {
        this.archivarPrestamo(prestamo.idPrestamo as number); // Llama al método de archivar real (casting a number es buena práctica)
    }
  }

  // **AJUSTE:** Método para llamar al servicio de archivar
  archivarPrestamo(idPrestamo: number): void {
      this.prestamoService.archivarPrestamo(idPrestamo).subscribe({ // Llama al nuevo método en el servicio
          next: (respuesta) => {
              console.log('Préstamo archivado:', respuesta);
              this.messageUtils.showMessage("Éxito", respuesta.message, "success"); // Mostrar mensaje de éxito
              this.cargarPrestamos(); // Recargar la lista para que el préstamo archivado desaparezca
          },
          error: (error) => {
              console.error('Error al archivar préstamo:', error);
              // Acceder a error.error.message si el backend envía ese formato
              const errorMessage = error.error?.message || "Error desconocido al archivar el préstamo.";
              this.messageUtils.showMessage("Error", errorMessage, "error"); // Mostrar mensaje de error
          }
      });
  }


  crearModal(modo: 'crear' | 'editar'): void {
    this.modoModal = modo;
    this.form.reset(); // Resetea los valores y estado del formulario

    // Usamos setTimeout para dar tiempo a Angular a procesar los cambios de *ngIf antes de configurar validadores/estado
    setTimeout(() => {
      if (modo === 'crear') {
        this.titleModal = 'Registrar Nuevo Préstamo';
        this.prestamoSelected = null; // Asegurarse de que no haya préstamo seleccionado en modo crear

        // Habilitar/Deshabilitar campos y configurar Validadores para modo CREAR
        this.form.get('idUsuario')?.enable();
        this.form.get('idLibro')?.enable();
        this.form.get('fechaDevolucion')?.enable();
        this.form.get('fechaEntrega')?.disable(); // Deshabilitar fecha de entrega en modo crear

        // Configurar validadores
        this.form.get('idUsuario')?.setValidators([Validators.required]);
        this.form.get('idLibro')?.setValidators([Validators.required]);

        // Validar que la fecha de devolución sea al menos el día siguiente a hoy
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        // minDateValidator compara la fecha (YYYY-MM-DD), por eso extraemos esa parte
        const tomorrowISO = tomorrow.toISOString().split('T')[0];

        this.form.get('fechaDevolucion')?.setValidators([
            Validators.required,
            minDateValidator(tomorrowISO) // Usa el validador personalizado
        ]);

        // Asegurarse de que fechaEntrega no tenga validadores en modo crear
        this.form.get('fechaEntrega')?.clearValidators();
        this.form.get('fechaEntrega')?.setValue(''); // Asegurarse de que esté vacío

        this.cargarLibrosDisponibles(); // Cargar libros disponibles solo al crear

      } else { // modo === 'editar' (Registrar Devolución)
         this.titleModal = 'Registrar Devolución';

         // Deshabilitar campos que no se editan en modo devolución
         this.form.get('idUsuario')?.disable();
         this.form.get('idLibro')?.disable();
         this.form.get('fechaDevolucion')?.disable();
         this.form.get('fechaEntrega')?.enable(); // Habilitar solo fecha de entrega

         // Limpiar validadores de campos deshabilitados
         this.form.get('idUsuario')?.clearValidators();
         this.form.get('idLibro')?.clearValidators();
         this.form.get('fechaDevolucion')?.clearValidators();

         // Configurar validadores para fechaEntrega
         let minDateEntrega = '';
         if (this.prestamoSelected?.fechaPrestamo) {
              // Obtener la fecha de préstamo del objeto seleccionado
              // Asumimos que fechaPrestamo viene como string ISO 8601 de LocalDateTime
              const fechaPrestamoString = String(this.prestamoSelected.fechaPrestamo);
              const fechaPrestamoDate = new Date(fechaPrestamoString); // Convertir a Date

              if (isNaN(fechaPrestamoDate.getTime())) {
                   console.error('Error: Fecha de préstamo inválida en prestamoSelected', this.prestamoSelected.fechaPrestamo);
                   // Si la fecha es inválida, usar la fecha actual como mínimo (solo el día)
                   minDateEntrega = new Date().toISOString().split('T')[0];
              } else {
                 // La fecha mínima para la entrega es la fecha de préstamo (solo el día para el validador)
                 minDateEntrega = fechaPrestamoDate.toISOString().split('T')[0];
              }
         } else {
              // Si no hay préstamo seleccionado o fecha de préstamo (no debería pasar en editar)
              minDateEntrega = new Date().toISOString().split('T')[0];
         }

         this.form.get('fechaEntrega')?.setValidators([
              Validators.required,
              minDateValidator(minDateEntrega) // Valida que la fecha de entrega no sea anterior a la de préstamo (solo el día)
         ]);

         // Asegurarse de que otros campos no tengan validadores en modo editar
         this.form.get('idUsuario')?.clearValidators();
         this.form.get('idLibro')?.clearValidators();
         this.form.get('fechaDevolucion')?.clearValidators();

         // **AJUSTE:** Precargar la fecha de entrega en el form control si existe en el prestamoSelected
         // Esto se hace DENTRO del setTimeout para asegurar que el control esté habilitado.
         if (this.prestamoSelected && this.prestamoSelected.fechaEntrega) {
             // Asumimos que prestamo.fechaEntrega es un string o Date que Date puede parsear (ej: ISO 8601 de LocalDateTime)
             const fechaEntregaDate = new Date(this.prestamoSelected.fechaEntrega);

             // Formatear a "YYYY-MM-DDTHH:mm" que es lo que espera el input datetime-local
             const month = (fechaEntregaDate.getMonth() + 1).toString().padStart(2, '0');
             const day = fechaEntregaDate.getDate().toString().padStart(2, '0');
             const hours = fechaEntregaDate.getHours().toString().padStart(2, '0');
             const minutes = fechaEntregaDate.getMinutes().toString().padStart(2, '0');

             const formattedDate = `<span class="math-inline">\{fechaEntregaDate\.getFullYear\(\)\}\-</span>{month}-<span class="math-inline">\{day\}T</span>{hours}:${minutes}`;

             this.form.get('fechaEntrega')?.setValue(formattedDate);

         } else {
             // Si no hay fecha de entrega, asegúrate de que el campo esté vacío
             this.form.get('fechaEntrega')?.setValue('');
         }

      }
      // Llamar a updateValueAndValidity() después de todos los cambios de validadores/estado
      this.form.updateValueAndValidity();
    }, 0); // Retardo de 0 para que Angular complete el ciclo actual

    // Mostrar el modal puede ir fuera del setTimeout si no necesitas esperar por la configuración inicial
    this.mostrarModal();
  }

  // El método abrirModoEdicion ahora solo configura el prestamoSelected y llama a crearModal
  abrirModoEdicion(prestamo: Prestamo): void {
    this.prestamoSelected = prestamo;
    this.crearModal('editar'); // La lógica de precarga se movió DENTRO de crearModal en el setTimeout
    console.log('Préstamo seleccionado para edición:', this.prestamoSelected);
  }


  cerrarModal(): void {
    this.form.reset(); // Resetea los valores y el estado del formulario
    this.form.markAsPristine(); // Marca el formulario como no modificado
    this.form.markAsUntouched(); // Marca el formulario como no tocado

    // Resetear los valores a cadenas vacías explícitamente (puede ser redundante con form.reset)
    this.form.reset({
        idUsuario: '',
        idLibro: '',
        fechaDevolucion: '',
        fechaEntrega: ''
    });

    this.prestamoSelected = null; // Limpiar el préstamo seleccionado
    if (this.modalInstance) {
      this.modalInstance.hide(); // Ocultar el modal
    }

    // Limpiar validadores al cerrar para evitar problemas si se reabre el modal en otro modo
    this.form.get('idUsuario')?.clearValidators();
    this.form.get('idLibro')?.clearValidators();
    this.form.get('fechaDevolucion')?.clearValidators();
    this.form.get('fechaEntrega')?.clearValidators();
    this.form.updateValueAndValidity(); // Asegurarse de que los cambios de validación se apliquen
  }

  guardarActualizar(): void {
    this.form.markAllAsTouched(); // Marca todos los campos como tocados para mostrar validaciones

    if (this.form.valid) { // Verifica si el formulario es válido
      if (this.modoModal === 'crear') {
        console.log("Modo: Crear");
        // Crear el objeto PrestamoRq con los datos del formulario
        // Los valores de fechaDevolucion y fechaEntrega del form control ya son strings "YYYY-MM-DDTHH:mm"
        const nuevoPrestamo: prestamoRq = {
            idusuario: this.form.get('idUsuario')?.value,
            idlibro: this.form.get('idLibro')?.value,
            // **AJUSTE:** Obtiene el string "YYYY-MM-DDTHH:mm" directamente del form control
            fechaDevolucion: this.form.get('fechaDevolucion')?.value
        };

        // Llamada al servicio para CREAR el préstamo
        this.prestamoService.crearPrestamos(nuevoPrestamo)
          .subscribe({
            next: (data) => {
              console.log('Respuesta crear:', data.message);
              this.messageUtils.showMessage("Éxito", data.message, "success");
              this.cerrarModal(); // Cierra el modal al éxito
              this.cargarPrestamos(); // Recarga la lista de préstamos
            },
            error: (error) => {
              console.error('Error al crear préstamo:', error);
              // Muestra un mensaje de error amigable
              const errorMessage = error.error?.message || "Error desconocido al crear préstamo";
              this.messageUtils.showMessage("Error", errorMessage, "error");
            }
          });

      } else if (this.modoModal === 'editar' && this.prestamoSelected) {
        console.log("Modo: Actualizar (Registrar Devolución)");

        // Obtener el valor de la fecha de entrega del formulario
        // Es el string "YYYY-MM-DDTHH:mm" del input datetime-local
        const fechaEntregaValue: string = this.form.get('fechaEntrega')?.value;

        // Obtener el ID del préstamo seleccionado
        const idPrestamo = this.prestamoSelected.idPrestamo as number; // Casting a number

        // Llamada al servicio para ACTUALIZAR (registrar devolución)
        // El backend espera el ID en la ruta y la fecha en el cuerpo (como { fechaEntrega: "YYYY-MM-DDTHH:mm" })
        this.prestamoService.actualizarPrestamos(idPrestamo, fechaEntregaValue)
           .subscribe({
             next: (data) => {
               console.log('Respuesta actualizar:', data.message);
               this.messageUtils.showMessage("Éxito", data.message, "success");
               this.cerrarModal(); // Cierra el modal al éxito
               this.cargarPrestamos(); // Recarga la lista de préstamos
             },
             error: (error) => {
               console.error('Error al actualizar préstamo:', error);
               // Muestra un mensaje de error amigable
             const errorMessage = error.error?.message || "Error desconocido al actualizar préstamo.";
               this.messageUtils.showMessage("Error", errorMessage, "error");
             }
           });
      }
    } else {
      // Si el formulario no es válido, muestra una advertencia
      this.messageUtils.showMessage("Advertencia", "Por favor, complete los campos requeridos y corrija los errores.", "warning");
    }
  }

  // Método para mostrar el modal usando Bootstrap
  mostrarModal(): void {
    // Inicializa la instancia del modal si no existe
    if (!this.modalInstance && this.prestamoModalElement) {
      this.modalInstance = new bootstrap.Modal(this.prestamoModalElement.nativeElement);
    }
    // Muestra el modal
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }
}