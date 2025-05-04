import { Libro } from "./libro";
import { Usuario } from "./usuario";

export class Prestamo {
    idPrestamo: number;
    libro: Libro;
    usuario: Usuario;
    fechaPrestamo:string;
    fechaDevolucion:string;
    estado: string;
    fechaEntrega:string | null;    
}