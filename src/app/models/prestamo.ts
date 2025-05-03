import { Usuario } from './usuario';
import { Libro } from './libro';

export class Prestamo {
    idPrestamo: number;
    usuario: Usuario;
    libro: Libro;
    fechaPrestamo: Date;
    fechaDevolucion?: Date;
    fechaEntrega: Date;
    estado: string; 
}