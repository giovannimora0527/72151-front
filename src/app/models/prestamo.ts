import { Libro } from "./libro";
import { Usuario } from "./usuario";

export class Prestamo {
    idPrestamo: number;
    userId: number;
    libroId: number;
    fechaDevolucion: Date;
    fechaEntrega: Date;
    fechaPrestamo: Date;
    usuario: Usuario;
    libro: Libro;
    estado: string;
}