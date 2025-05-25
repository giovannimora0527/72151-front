/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { MultaService } from './service/multa.service';

import { CommonModule } from '@angular/common';
import { Multa } from 'src/app/models/multa';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';

import { UsuarioService } from '../usuario/service/usuario.service'; 
import { Usuario } from 'src/app/models/usuario';

import { LibroService } from '../libro/service/libro.service';
import { Libro } from 'src/app/models/libro';

import { PrestamoService } from '../prestamo/service/prestamo.service';
import { Prestamo } from 'src/app/models/prestamo';

// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-multa',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './multa.component.html',
  styleUrl: './multa.component.scss'
})
export class MultaComponent {
  multas: Multa[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = "";

  multaSelected: Multa;

  usuarios: Usuario[] = [];
  libros: Libro[] = [];
  prestamos: Prestamo[] = [];


  form: FormGroup = new FormGroup({
    usuarioId: new FormControl(''),
    libroId: new FormControl(''),
    prestamoId: new FormControl(''),
    concepto: new FormControl(''),
    monto: new FormControl(''),
    fechaMulta: new FormControl(''),
    fechaPago: new FormControl(''),
    estado: new FormControl('')
  });

  constructor(
    private multaService: MultaService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils,
    private usuarioService: UsuarioService,
    private libroService: LibroService,
    private prestamoService: PrestamoService
  ) {
    this.cargarListaMultas();
    this.cargarUsuarios();
    this.cargarLibros();
    this.cargarPrestamos();
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
    this.libroService.getLibros().subscribe(
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

  cargarPrestamos(){
    this.prestamoService.getPrestamos().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.prestamos = data;
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
      prestamoId: ['', [Validators.required]],
      concepto: [''],
      monto: ['', [Validators.required]],
      fechaMulta: ['', [Validators.required]], // No es necesaria la validación porque se le puede dar un valor automatico en el back, a menos que envie un valor desde el front
      fechaPago: [''], // No es necesaria la validación ya que en un principio el valor es nulo
      estado: ['', [Validators.required]] // No es necesaria la validación porque se le da un valor en el back, a menos que envie un valor desde el front
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaMultas() {
    this.multaService.getMultas().subscribe({
      next: (data) => {
        console.log(data);
        this.multas = data;
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  crearMultaModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearMultaModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm == "C"? "Crear Multa": "Actualizar Multa";

    if (modoForm === 'C') {
      const localISOTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      this.form.reset({ // Yo puedo hacer que vaya cargado desde el front o hacerlo en el back
        //fechaPrestamo: new Date().toISOString().slice(0,16), // formato para datetime-local, pero 5 horas por delante a la hora local colombiana jaja
        fechaMulta: localISOTime,
        estado: 'PENDIENTE', // Asignamos el valor por defecto
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
      prestamoId: "",
      concepto: "",
      monto: "",
      fechaMulta: "",
      fechaPago: "",
      estado: ""
    });

    // Habilitar el campo fechaEntrega por si acaso
    this.form.get('fechaPago')?.enable();

    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.multaSelected = null;
  }

  abrirModoEdicion(multa: Multa) {
    this.multaSelected = multa;
    this.form.patchValue({
      usuarioId: this.multaSelected.usuario.idUsuario,
      libroId: this.multaSelected.libro.idLibro,
      prestamoId: this.multaSelected.prestamo.idPrestamo,
      concepto: this.multaSelected.concepto,
      monto: this.multaSelected.monto,
      fechaMulta: this.multaSelected.fechaMulta,
      fechaPago: this.multaSelected.fechaPago,
      estado: this.multaSelected.estado
    });
    console.log(this.form);
    console.log(this.multaSelected);

    // Deshabilitar el campo fechaEntrega si ya tiene valor
    if (this.multaSelected.fechaPago) {
      this.form.get('fechaPago')?.disable();
    }

    this.crearMultaModal('E');
    console.log(this.multaSelected);
  }

  guardarActualizarMulta() {
    console.log('Entro');
    console.log(this.form.valid);

    if (this.form.valid) {
      console.log(this.form.getRawValue());
      console.log('El formulario es valido');     
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos una multa nueva');
        this.multaService.crearMulta(this.form.getRawValue())
        .subscribe(
          {
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarListaMultas();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          }
        );
      } else {
        console.log('Actualizamos una multa existente');
        const idMulta = this.multaSelected.idMulta;

        this.multaSelected = {
          idMulta: idMulta, // aseguramos que idMulta no cambie
          ...this.form.getRawValue(), // actualizamos solo con los datos del formulario
        };  
        this.multaService.actualizarMulta(this.multaSelected)
        .subscribe(
          {
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarListaMultas();
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
 
