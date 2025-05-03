import { Libro } from "./libro";
import { Usuario } from "./usuario";


export interface Prestamo {
    idPrestamo: number;
    usuario: Usuario;       
    libro: Libro;          
    fechaPrestamo: Date;   
    fechaDevolucion: Date;  
    fechaEntrega?: Date;   
    estado: 'PRESTADO' | 'VENCIDO' | 'DEVUELTO';
  }