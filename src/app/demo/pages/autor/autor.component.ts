import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import { MessageUtils } from 'src/app/utils/message-utils';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';

declare var bootstrap: any;


@Component({
  selector: 'app-autor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})


export class AutorComponent {
  autores: Autor[] = [];
  modalInstance: any;
  titleModal: string = "";
  modoFormulario: string = '';

  autorSelected: Autor;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidad: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils
  ) {
    this.cargarListaAutores();
    this.cargarFormulario();
  }

  cargarFormulario(){
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  cargarListaAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        console.log('Datos recibidos del servidor:', data);
        this.autores = data.map(autor => ({
          ...autor,
          idAutor: autor.autorId,
        }));
        console.log('Autores procesados:', this.autores);
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }

  cargarAutorModal(){
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) { 
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    } 
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearAutorModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm == "C"? "Crear Autor": "Actualizar Autor";
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
      nombre: "",
      nacionalidad: "",
      fechaNacimiento: ""
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.autorSelected = null;
  }


  abrirModoEdicion(autor: Autor) {
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: this.autorSelected.nombre,
      nacionalidad: this.autorSelected.nacionalidad,
      fechaNacimiento: this.autorSelected.fechaNacimiento
    });
    this.crearAutorModal('E');
    console.log('Autor seleccionado:', this.autorSelected);
  }

  guardarActualizarAutor() {
    if (this.form.valid) {
      if (this.modoFormulario === 'C') {
        this.autorService.crearAutor(this.form.getRawValue())
        .subscribe({
            next: (data) => {
              this.cerrarModal();
              this.cargarListaAutores();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          }
        );
      } else {
        // Modo Edición
        
        const idAutor = this.autorSelected.autorId;
        const autorActualizado: Autor = {
          autorId: idAutor,
          ...this.form.getRawValue()
        };
        console.log(idAutor);
        console.log(autorActualizado);
        
        this.autorService.actualizarAutor(autorActualizado)
        .subscribe({
            next: (data) => {
              this.cerrarModal();
              this.cargarListaAutores();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          }
        );
      }
    }
  }
}





