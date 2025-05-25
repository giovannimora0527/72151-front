import { Usuario } from "./usuario";
import { Libro } from "./libro";
import { Prestamo } from "./prestamo";

export class Multa {
    idMulta?: number;
    usuario?: Usuario;
    libro?: Libro;
    prestamo?: Prestamo;
    concepto?: string;
    monto?: number;
    fechaMulta?: string; // datetime-local
    fechaPago?: string;
    estado?: 'PENDIENTE' | 'PAGADO';
}