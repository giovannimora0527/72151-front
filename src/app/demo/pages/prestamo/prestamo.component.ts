/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { PrestamoService } from './service/prestamo.service';

import { CommonModule } from '@angular/common';
import { Prestamo } from 'src/app/models/prestamo';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';

import { UsuarioService } from '../usuario/service/usuario.service'; 
import { Usuario } from 'src/app/models/usuario';

import { LibroService } from '../libro/service/libro.service';
import { Libro } from 'src/app/models/libro';

// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {
  prestamos: Prestamo[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = "";

  prestamoSelected: Prestamo;

  usuarios: Usuario[] = [];
  libros: Libro[] = [];


  form: FormGroup = new FormGroup({
    usuarioId: new FormControl(''),
    libroId: new FormControl(''),
    fechaPrestamo: new FormControl(''),
    fechaDevolucion: new FormControl(''),
    fechaEntrega: new FormControl(''),
    estado: new FormControl('')
  });

  constructor(
    private prestamoService: PrestamoService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils,
    private usuarioService: UsuarioService,
    private libroService: LibroService
  ) {
    this.cargarListaPrestamos();
    this.cargarUsuarios();
    this.cargarLibros();
    this.cargarFormulario();
  }

  cargarUsuarios(){
    this.usuarioService.getUsuarios().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.usuarios = data;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

  cargarLibros(){
    this.libroService.getLibrosDisponibles().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.libros = data;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      usuarioId: ['', [Validators.required]],
      libroId: ['', [Validators.required]],
      fechaPrestamo: ['', [Validators.required]], // No es necesaria la validación porque se le puede dar un valor automatico en el back, a menos que envie un valor desde el front
      fechaDevolucion: ['', [Validators.required]],
      fechaEntrega: [''], // No es necesaria la validación ya que en un principio el valor es nulo
      estado: ['', [Validators.required]] // No es necesaria la validación porque se le da un valor en el back, a menos que envie un valor desde el front
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaPrestamos() {
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        console.log(data);
        this.prestamos = data;
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  crearPrestamoModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearPrestamoModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm == "C"? "Crear Prestamo": "Actualizar Prestamo";

    if (modoForm === 'C') {
      const localISOTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      this.form.reset({ // Yo puedo hacer que vaya cargado desde el front o hacerlo en el back
        //fechaPrestamo: new Date().toISOString().slice(0,16), // formato para datetime-local, pero 5 horas por delante a la hora local colombiana jaja
        fechaPrestamo: localISOTime,
        estado: 'PRESTADO', // Asignamos el valor por defecto
      });
    }

    if (modalElement) {
      // Verificar si ya existe una instancia del modal
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
    this.form.reset({
      usuarioId: "",
      libroId: "",
      fechaPrestamo: "",
      fechaDevolucion: "",
      fechaEntrega: "",
      estado: ""
    });

    // Habilitar el campo fechaEntrega por si acaso
    this.form.get('fechaEntrega')?.enable();

    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.prestamoSelected = null;
  }

  abrirModoEdicion(prestamo: Prestamo) {
    this.prestamoSelected = prestamo;
    this.form.patchValue({
      usuarioId: this.prestamoSelected.usuario.idUsuario,
      libroId: this.prestamoSelected.libro.idLibro,
      fechaPrestamo: this.prestamoSelected.fechaPrestamo,
      fechaDevolucion: this.prestamoSelected.fechaDevolucion,
      fechaEntrega: this.prestamoSelected.fechaEntrega,
      estado: this.prestamoSelected.estado
    });
    console.log(this.form);
    console.log(this.prestamoSelected);

    // Deshabilitar el campo fechaEntrega si ya tiene valor
    if (this.prestamoSelected.fechaEntrega) {
      this.form.get('fechaEntrega')?.disable();
    }

    this.crearPrestamoModal('E');
    console.log(this.prestamoSelected);
  }

  guardarActualizarPrestamo() {
    console.log('Entro');
    console.log(this.form.valid);

    if (this.form.valid) {
      console.log(this.form.getRawValue());
      console.log('El formulario es valido');     
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un prestamo nuevo');
        this.prestamoService.crearPrestamo(this.form.getRawValue())
        .subscribe(
          {
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarListaPrestamos();
              this.cargarLibros(); // Refrescamos la lista de libros disponibles
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          }
        );
      } else {
        console.log('Actualizamos un prestamo existente');
        const idPrestamo = this.prestamoSelected.idPrestamo;

        this.prestamoSelected = {
          idPrestamo: idPrestamo, // aseguramos que idPrestamo no cambie
          ...this.form.getRawValue(), // actualizamos solo con los datos del formulario
        };  
        this.prestamoService.actualizarPrestamo(this.prestamoSelected)
        .subscribe(
          {
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarListaPrestamos();
              this.cargarLibros(); // Refrescamos la lista de libros disponibles
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          }
        );
      }
    }
  }
}
 