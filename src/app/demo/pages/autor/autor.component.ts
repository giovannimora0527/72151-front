/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageUtils } from 'src/app/utils/message-utils';
import { Autor } from 'src/app/models/autor';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  Validators
} from '@angular/forms';
import { AutorService } from './service/autor.service';
import { Nacionalidad } from 'src/app/models/Nacionalidad';
import { NacionalidadService } from 'src/app/services/Nacionalidad.service';

// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  modalInstance: any;
  titleModal: string = '';
  modoFormulario: string = '';
  autores: Autor[] = [];
  autorSelected: Autor;

  nacionalidades: Nacionalidad[] = [];

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    nacionalidad: new FormControl('')
  });

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly formBuilder: FormBuilder,
    private readonly autorService: AutorService,
    private readonly nacionalidadService: NacionalidadService
  ) {
    this.cargarAutores();
    this.cargarNacionalidades(); // 🔁 Aquí dentro se invoca cargarFormulario()
  }

  cargarNacionalidades() {
    this.nacionalidadService.getNacionalidades().subscribe({
      next: (data: Nacionalidad[]) => {
        this.nacionalidades = data;

        // ✅ Crear formulario después de tener nacionalidades cargadas
        this.cargarFormulario();

        // ✅ Setear nacionalidad por defecto (como objeto)
        const nacionalidadDefault = this.nacionalidades.find(n => n.nombre === 'Colombiana');
        if (nacionalidadDefault) {
          this.form.controls['nacionalidad'].setValue(nacionalidadDefault);
        }
      },
      error: (error) => {
        console.error('Error cargando nacionalidades', error);
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      nacionalidad: [null, [Validators.required]] // se asegura que sea un objeto, no string
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarAutores() {
    this.autorService.listarAutores().subscribe({
      next: (data: Autor[]) => {
        this.autores = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearModal');
    modalElement?.blur();
    modalElement?.setAttribute('aria-hidden', 'false');
    this.titleModal = modoForm === 'C' ? 'Crear Autor' : 'Actualizar Autor';
    if (modalElement) {
      this.modalInstance ??= new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(autor: Autor) {
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: this.autorSelected.nombre,
      fechaNacimiento: this.autorSelected.fechaNacimiento,
      nacionalidad: this.autorSelected.nacionalidad
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
    this.autorSelected = null;
  }

  guardarActualizar() {
    console.log('Estado del formulario:', this.form.status);
    console.log('Valores del formulario:', this.form.value);
    console.log('Errores del formulario:', this.form.errors);
  
    // Verificar cada control individualmente
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      console.log(`Control: ${key}, válido: ${control?.valid}, errores:`, control?.errors);
    });
  
    // Asegúrate de enviar un objeto completo de Nacionalidad, no solo el nombre.
const autorPayload = this.form.getRawValue(); // Esto ya es un objeto

// Ahora autorPayload.nacionalidad será un objeto de tipo Nacionalidad
if (this.form.valid) {
  if (this.modoFormulario === 'C') {
    this.autorService.crearAutor(autorPayload).subscribe({
      next: () => {
        this.messageUtils.showMessage("Éxito", "Autor creado correctamente", "success");
        this.cerrarModal();
        this.cargarAutores();
      },
      error: (error) => {
        this.messageUtils.showMessage("Error", error.error.message, "error");
      }
    });
  } else {
    const autorActualizado: Autor = {
      ...this.autorSelected,
      ...autorPayload
    };
    this.autorService.actualizarAutor(autorActualizado).subscribe({
      next: () => {
        this.messageUtils.showMessage("Éxito", "Autor actualizado correctamente", "success");
        this.cerrarModal();
        this.cargarAutores();
      },
      error: (error) => {
        this.messageUtils.showMessage("Error", error.error.message, "error");
      }
    });
  }
} else {
  this.messageUtils.showMessage("Advertencia", "El formulario no es válido", "warning");
}
  }
  
}
