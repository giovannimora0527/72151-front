import { Libro } from "../libro/libro";
import { Usuario } from "../usuario/usuario";

export interface Prestamo {
    idPrestamo: number;
    usuario: Usuario;       
    libro: Libro;          
    fechaPrestamo: Date;   
    fechaDevolucion: Date;  
    fechaEntrega?: Date;   
    estado: 'PRESTADO' | 'VENCIDO' | 'DEVUELTO';
  }