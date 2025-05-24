import { Prestamo } from './prestamo';
import { Usuario } from './usuario';

export type EstadoPago = 'CANCELADO' | 'NO_CANCELADO';
export type MetodoPago = 'EFECTIVO' | 'NEQUI' | 'DÉBITO';

export class Deuda {
  idDeuda?: number;
  prestamo: Prestamo;
  valorDeuda: number;
  multaFija: number;                          // Se inicializa en backend como 20000.00
  estadoPago: EstadoPago;
  fechaPago?: Date;                           // LocalDateTime → Date
  metodoPago?: MetodoPago;
  usuario: Usuario;
  fechaGeneracion: Date;                      // LocalDate → Date
  fechaLimitePago: Date;                      // LocalDate → Date
  estado: boolean;       

}
