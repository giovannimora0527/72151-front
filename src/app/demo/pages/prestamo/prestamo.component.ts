import { Component, OnInit } from '@angular/core';
import { Libro } from 'src/app/models/libro';
import { Prestamo } from 'src/app/models/prestamo';
import { Usuario } from 'src/app/models/usuario';
import { PrestamoService } from './service/prestamo.service';
import { UsuarioService } from '../usuario/service/usuario.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.scss']
})
export class PrestamoComponent implements OnInit {
  prestamos: Prestamo[] = [];
  librosDisponibles: Libro[] = [];
  usuarios: Usuario[] = [];
  nuevoPrestamo: Prestamo;
  prestamoSelected: Prestamo;


  form: FormGroup = new FormGroup({
    libroId: new FormControl(''),
    usuarioId: new FormControl(''),
    fechaDevolucion: new FormControl(''),
    fechaEntrega: new FormControl('')
  });

  constructor(private readonly prestamoService: PrestamoService,
    private readonly usuarioService: UsuarioService,
    private readonly messageUtils: MessageUtils,
    private readonly formBuilder: FormBuilder,
  ) {
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      libroId: ['', [Validators.required]],
      usuarioId: ['', [Validators.required]],
      fechaDevolucion: ['', [Validators.required]],
      fechaEntrega: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.prestamoService.listar().subscribe({
      next: (prestamos: Prestamo[]) => {
        this.prestamos = prestamos;
      },
      error: (err: any) => {
        console.error('Error al cargar los préstamos:', err);
      }
    });

    this.prestamoService.listarLibrosDisponibles()
      .subscribe(
        {
          next: (data) => {
            this.librosDisponibles = data;
          },
          error: (error) => {
            console.log(error);
            this.messageUtils.showMessage("Error", error.error.message, "error");
          }

        });

    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
      },
      error: (err: any) => {
        console.error('Error al cargar los usuarios:', err);
      }
    });
  }


  crearPrestamo(): void {
    if (!this.form.valid) {
      console.error('Formulario no válido');
      return;
    }

    this.prestamoService.crearPrestamo(this.nuevoPrestamo).subscribe({
      next: (data) => {
        this.cargarDatos()
        this.resetFormulario();
      },
      error: (err: any) => {
        console.error('Error al crear el préstamo:', err);
      }
    });
  }

  resetFormulario(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      nombre: "",
      correo: "",
      telefono: "",
      activo: ""
    });

    this.prestamoSelected = null;
  }
}
