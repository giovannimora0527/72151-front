// src/app/demo/pages/prestamos/prestamos.component.ts

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from 'src/app/models/libro';
import { Usuario } from 'src/app/models/usuario';
import { Prestamo } from 'src/app/models/prestamo';
import { prestamoRq } from 'src/app/models/prestamoRq'; // **CORREGIDO:** Importar con el nombre y ruta correctos

import { FormGroup, FormControl, FormBuilder, FormsModule, ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
import { LibroService } from '../libro/service/libro.service';
import { UsuarioService } from '../usuario/service/usuario.service';
import { prestamoService } from './service/prestamos.service'; // **CORREGIDO:** Importar con el nombre y ruta correctos

import { Observable } from 'rxjs';
import { minDateValidator } from 'src/app/utils/date.validators'; // **CORREGIDO:** Importar el validador

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamos.component.html',
  styleUrl: './prestamos.component.scss'
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
    private libroService: LibroService,
    private usuarioService: UsuarioService,
    private prestamoService: prestamoService
  ) {
    this.form = this.formBuilder.group({
      idUsuario: ['', []],
      idLibro: ['', []],
      fechaDevolucion: ['', []],
      fechaEntrega: ['', []]
    });
  }

  ngOnInit(): void {
    this.cargarPrestamos();
    this.cargarUsuarios();
  }

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
        this.messageUtils.showMessage("Error", "Error al cargar préstamos.", "error");
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
        this.messageUtils.showMessage("Error", "Error al cargar usuarios.", "error");
      }
    });
  }

  cargarLibrosDisponibles(): void {
    this.libroService.getLibrosDisponibles().subscribe({
      next: (data: Libro[]) => {
        this.librosDisponibles = data;
      },
      error: (error) => {
        console.error('Error al cargar libros disponibles:', error);
        this.messageUtils.showMessage("Error", "Error al cargar libros disponibles.", "error");
      }
    });
  }

  crearModal(modo: 'crear' | 'editar'): void {
    this.modoModal = modo;
    this.form.reset();

    if (modo === 'crear') {
      this.titleModal = 'Registrar Nuevo Préstamo';
      this.prestamoSelected = null;

      this.form.get('idUsuario')?.enable();
      this.form.get('idLibro')?.enable();
      this.form.get('fechaDevolucion')?.enable();

      this.form.get('idUsuario')?.setValidators([Validators.required]);
      this.form.get('idLibro')?.setValidators([Validators.required]);

       const today = new Date();
       const tomorrow = new Date(today);
       tomorrow.setDate(tomorrow.getDate() + 1);
       const tomorrowISO = tomorrow.toISOString().split('T')[0];

       this.form.get('fechaDevolucion')?.setValidators([
           Validators.required,
           minDateValidator(tomorrowISO) // **CORREGIDO:** Usar validador personalizado
       ]);

      this.form.get('fechaEntrega')?.disable();
      this.form.get('fechaEntrega')?.clearValidators();
      this.form.get('fechaEntrega')?.setValue('');

      this.cargarLibrosDisponibles();

    } else {
       this.titleModal = 'Registrar Devolución';

       this.form.get('idUsuario')?.disable();
       this.form.get('idLibro')?.disable();
       this.form.get('fechaDevolucion')?.disable();

       this.form.get('idUsuario')?.clearValidators();
       this.form.get('idLibro')?.clearValidators();
       this.form.get('fechaDevolucion')?.clearValidators();

       this.form.get('fechaEntrega')?.enable();

       let minDateEntrega = '';
       if (this.prestamoSelected?.fechaPrestamo) {
           const fechaPrestamoString = String(this.prestamoSelected.fechaPrestamo);
           const fechaPrestamoDate = new Date(fechaPrestamoString);

            if (isNaN(fechaPrestamoDate.getTime())) {
                 console.error('Error: Fecha de préstamo inválida en prestamoSelected', this.prestamoSelected.fechaPrestamo);
                 minDateEntrega = new Date().toISOString().split('T')[0];
            } else {
                minDateEntrega = fechaPrestamoDate.toISOString().split('T')[0];
            }
       } else {
            minDateEntrega = new Date().toISOString().split('T')[0];
       }

       this.form.get('fechaEntrega')?.setValidators([
            Validators.required,
            minDateValidator(minDateEntrega) // **CORREGIDO:** Usar validador personalizado
       ]);
    }

    this.form.updateValueAndValidity();
    this.mostrarModal();
  }

  abrirModoEdicion(prestamo: Prestamo): void {
    this.prestamoSelected = prestamo;
    this.crearModal('editar');
    console.log('Préstamo seleccionado para edición:', this.prestamoSelected);
  }

  cerrarModal(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
       idUsuario: '',
       idLibro: '',
       fechaDevolucion: '',
       fechaEntrega: ''
    });

    this.prestamoSelected = null;
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.form.get('idUsuario')?.clearValidators();
    this.form.get('idLibro')?.clearValidators();
    this.form.get('fechaDevolucion')?.clearValidators();
    this.form.get('fechaEntrega')?.clearValidators();
    this.form.updateValueAndValidity();
  }

  guardarActualizar(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.modoModal === 'crear') {
        console.log("Modo: Crear");
        const nuevoPrestamoRq: prestamoRq = { // **CORREGIDO:** Usar nombre de clase correcto
           idusuario: this.form.get('idUsuario')?.value,
           idlibro: this.form.get('idLibro')?.value,
           fechaDevolucion: this.form.get('fechaDevolucion')?.value
        };

        this.prestamoService.crearPrestamos(nuevoPrestamoRq) // **CORREGIDO:** Pasa PrestamoRq
          .subscribe({
            next: (data) => {
              console.log('Respuesta crear:', data.message);
              this.messageUtils.showMessage("Éxito", data.message, "success");
              this.cerrarModal();
              this.cargarPrestamos();
            },
            error: (error) => {
              console.error('Error al crear préstamo:', error);
              this.messageUtils.showMessage("Error", error.error?.message || "Error desconocido al crear préstamo", "error");
            }
          });

      } else if (this.modoModal === 'editar' && this.prestamoSelected) {
        console.log("Modo: Actualizar (Devolución)");

        const fechaEntregaValue: string = this.form.get('fechaEntrega')?.value;

        const idPrestamo = this.prestamoSelected.idPrestamo;

        this.prestamoService.actualizarPrestamos(idPrestamo, fechaEntregaValue) // **CORREGIDO:** Pasa id (number) y fecha (string)
           .subscribe({
             next: (data) => {
               console.log('Respuesta actualizar:', data.message);
               this.messageUtils.showMessage("Éxito", data.message, "success");
               this.cerrarModal();
               this.cargarPrestamos();
             },
             error: (error) => {
               console.error('Error al actualizar préstamo:', error);
               this.messageUtils.showMessage("Error", error.error?.message || "Error desconocido al actualizar préstamo", "error");
             }
           });
      }
    } else {
      this.messageUtils.showMessage("Advertencia", "Por favor, complete los campos requeridos.", "warning");
    }
  }

   mostrarModal(): void {
     if (!this.modalInstance && this.prestamoModalElement) {
       this.modalInstance = new bootstrap.Modal(this.prestamoModalElement.nativeElement);
     }
     if (this.modalInstance) {
       this.modalInstance.show();
     }
   }
}