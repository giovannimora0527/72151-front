import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageUtils } from 'src/app/utils/message-utils';
import { FormGroup, FormControl, FormBuilder, FormsModule, ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
//Import Services
import { LibroService } from '../libro/service/libro.service'; 
import { UsuarioService } from '../usuario/service/usuario.service';
import { PrestamoService } from './service/prestamo.service';
// import Classes
import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';
import { Prestamo } from 'src/app/models/prestamo';

declare const bootstrap: any; 

@Component({
  selector: 'app-prestamo',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})

export class PrestamoComponent {
  modalInstance: any;
  titleModal: string = '';
  modoFormulario: string = '';
  usuarios: Usuario[] = []; 
  libros: Libro[] = []; 
  prestamos: Prestamo[] = []; 
  

  libroSelected: Libro;
  usuarioSelected: Usuario;
  prestamoSelected: Prestamo; 

  form: FormGroup = new FormGroup({
    usuarioId: new FormControl(''),
    libroId: new FormControl(''),
    fechaPrestamo: new FormControl(''),
    fechaDevolucion: new FormControl(''),
    fechaEntrega: new FormControl(''),
    estado: new FormControl('')
  });

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly formBuilder: FormBuilder,
    private readonly libroService: LibroService,
    private readonly usuarioService: UsuarioService,
    private readonly prestamoService: PrestamoService
  ) {
    this.cargarLibrosDisponibles();
    this.cargarUsuarios();
    this.cargarFormulario();
    this.cargarPrestamos();
  }

  cargarPrestamos(){
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        console.log(data);       
        this.prestamos = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  cargarUsuarios() {
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

  cargarLibrosDisponibles() {
    this.libroService.getLibrosDisponibles().subscribe({
      next: (data) => {
        console.log(data);
        this.libros = data;
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      usuarioId: ['', [Validators.required]],
      libroId: ['', [Validators.required]],
      fechaDevolucion: ['', [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  crearPrestamoModal(modoForm: string) {
    this.modoFormulario = modoForm;
    if (modoForm === 'C') {
      this.libroService.getLibrosDisponibles().subscribe({
        next: (data) => {
          this.libros = data;
          this.cargarFormulario(); // Reinicia el formulario con libroId vacío
          // Ahora sí, muestra el modal
          const modalElement = document.getElementById('crearPrestamoModal');
          modalElement.blur();
          modalElement.setAttribute('aria-hidden', 'false');
          this.titleModal = "Crear Prestamo";
          if (modalElement) {
            if (!this.modalInstance) {
              this.modalInstance = new bootstrap.Modal(modalElement);
            }
            this.modalInstance.show();
          }
        },
        error: (error) => {
          this.messageUtils.showMessage('Error', error.error.message, 'error');
        }
      });
    } else {
      // Para edición, sigue igual
      const modalElement = document.getElementById('crearPrestamoModal');
      modalElement.blur();
      modalElement.setAttribute('aria-hidden', 'false');
      this.titleModal = "Actualizar Prestamo";
      if (modalElement) {
        if (!this.modalInstance) {
          this.modalInstance = new bootstrap.Modal(modalElement);
        }
        this.modalInstance.show();
      }
    }
  }

  abrirModoEdicion(prestamo: Prestamo) {
    this.prestamoSelected = prestamo;
    this.form.reset();
    
    this.form = this.formBuilder.group({
      fechaEntrega: ['', [Validators.required]]
    });

    this.crearPrestamoModal('E');
  }

  cerrarModal() {
    this.form.reset();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.prestamoSelected = null;
    
    if (this.modoFormulario === 'C') {
      this.cargarFormulario();
    }
  }

  guardarActualizar() {
    console.log(this.form.getRawValue());
    if(this.form.valid){
      if(this.modoFormulario === 'C'){
        console.log("Crear");
        const prestamoForm = this.form.getRawValue();
        prestamoForm.fechaDevolucion = prestamoForm.fechaDevolucion + 'T00:00:00';

        this.prestamoService.crearPrestamo(prestamoForm)
          .subscribe({
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarPrestamos();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          });
      } else {
        console.log('Actualizar');
        const idPrestamo = this.prestamoSelected.idPrestamo;
        const fechaEntrega = new Date(this.form.get('fechaEntrega').value);
        const fechaDevolucion = new Date(this.prestamoSelected.fechaDevolucion);
        
        this.prestamoSelected = {
          ...this.prestamoSelected,
          idPrestamo: idPrestamo,
          fechaEntrega: new Date(fechaEntrega),
          estado: fechaEntrega > fechaDevolucion ? 'VENCIDO' : 'DEVUELTO'
        };

        this.prestamoService.actualizarPrestamo(this.prestamoSelected)
          .subscribe({
            next: (data) => {
              console.log(data);
              this.cerrarModal();
              this.cargarPrestamos();
              this.messageUtils.showMessage("Éxito", data.message, "success");
            },
            error: (error) => {
              console.log(error);
              this.messageUtils.showMessage("Error", error.error.message, "error");
            }
          });
      }
    } else {
      this.messageUtils.showMessage("Advertencia","El formulario no es valido", "warning")
    }
  }
}




