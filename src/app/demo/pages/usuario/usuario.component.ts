<<<<<<< HEAD
=======
/* eslint-disable @typescript-eslint/no-explicit-any */
>>>>>>> 267e173 (Frontend corte 2)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
<<<<<<< HEAD
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
declare var bootstrap: any;

@Component({
  selector: 'app-usuario',
  imports: [CommonModule],
=======
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
>>>>>>> 267e173 (Frontend corte 2)
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  modalInstance: any;
<<<<<<< HEAD

  form: FormGroup = new FormGroup({
    nombreCompleto: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl('')
=======
  modoFormulario: string = '';
  titleModal: string = "";

  usuarioSelected: Usuario;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl(''),
    activo: new FormControl('')
>>>>>>> 267e173 (Frontend corte 2)
  });

  constructor(
    private usuarioService: UsuarioService,
<<<<<<< HEAD
    private formBuilder: FormBuilder
=======
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils
>>>>>>> 267e173 (Frontend corte 2)
  ) {
    this.cargarListaUsuarios();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
<<<<<<< HEAD
      nombreCompleto: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });
  }

=======
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      activo: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

>>>>>>> 267e173 (Frontend corte 2)
  cargarListaUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log(data);
        this.usuarios = data;
      },
      error: (error) => {
<<<<<<< HEAD
        Swal.fire('Error', error.error.message, 'error');
=======
        this.messageUtils.showMessage('Error', error.error.message, 'error');
>>>>>>> 267e173 (Frontend corte 2)
      }
    });
  }

<<<<<<< HEAD
  crearUsuarioModal() {
    const modalElement = document.getElementById('crearUsuarioModal');
=======
  crearUsuarioModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearUsuarioModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm == "C"? "Crear Usuario": "Actualizar Usuario";
>>>>>>> 267e173 (Frontend corte 2)
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

<<<<<<< HEAD
  cerrarModal() {
    this.form.reset();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
=======
  cerrarModal() { 
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      nombre: "",
      correo: "",
      telefono: "",
      activo: ""
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.usuarioSelected = null;
  }

  abrirModoEdicion(usuario: Usuario) {
    this.usuarioSelected = usuario;
    this.form.patchValue({
      nombre: this.usuarioSelected.nombre,
      correo: this.usuarioSelected.correo,
      telefono: this.usuarioSelected.telefono,
      activo: !!this.usuarioSelected.activo  // asegura que sea booleano
    });
    this.crearUsuarioModal('E');
    console.log(this.usuarioSelected);
  }

  guardarActualizarUsuario() {
    console.log('Entro');
    console.log(this.form.valid);
    if (this.form.valid) {
      console.log(this.form.getRawValue());
      console.log('El formualario es valido');     
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un usuario nuevo');
        this.usuarioService.crearUsuario(this.form.getRawValue())
        .subscribe(
          {
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarListaUsuarios();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          }
        );
      } else {
        console.log('Actualizamos un usuario existente');
        const idUsuario = this.usuarioSelected.idUsuario;
        this.usuarioSelected = {
          idUsuario: idUsuario,
          ...this.form.getRawValue()
        };             
        this.usuarioService.actualizarUsuario(this.usuarioSelected)
        .subscribe(
          {
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarListaUsuarios();
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
>>>>>>> 267e173 (Frontend corte 2)
  }
}
