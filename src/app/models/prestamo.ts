import { Usuario } from "./usuario";
import { Libro } from "./libro";

export class Prestamo {
    idPrestamo?: number;
    usuario?: Usuario;
    libro?: Libro;
    fechaPrestamo?: string; // datetime-local
    fechaDevolucion?: string;
    fechaEntrega?: string;
    estado?: 'PRESTADO' | 'DEVUELTO' | 'VENCIDO';
}