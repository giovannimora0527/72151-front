/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = "";

  usuarioSelected: Usuario;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl('')
  });

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils
  ) {
    this.cargarListaUsuarios();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log(data);
        this.usuarios = data;
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  crearUsuarioModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearUsuarioModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm == "C"? "Crear Usuario": "Actualizar Usuario";
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
      nombreCompleto: "",
      correo: "",
      telefono: ""
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  abrirModoEdicion(usuario: Usuario) {
    this.usuarioSelected = usuario;
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
      }
    }
  }
}