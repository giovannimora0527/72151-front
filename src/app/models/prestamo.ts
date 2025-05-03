import { Usuario } from './usuario';
import { Libro } from './libro';

export type EstadoPrestamo = 'PRESTADO' | 'DEVUELTO' | 'VENCIDO';

export class Prestamo {
  idPrestamo?: number;
  usuario: Usuario;
  libro: Libro;
  fechaPrestamo?: Date;          // LocalDateTime → Date en frontend
  fechaDevolucion: Date;         // LocalDate → Date
  estado: EstadoPrestamo;
  fechaEntrega?: Date;           // LocalDateTime → Date opcional
}