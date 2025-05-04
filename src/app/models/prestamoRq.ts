import { Usuario } from "./usuario";
import { Libro } from "./libro";

export class PrestamoRq {
    usuario?: Usuario;
    libro?: Libro;
    fechaPrestamo?: string; // datetime-local
    fechaDevolucion?: string;
    fechaEntrega?: string;
}