import { Nacionalidad } from './Nacionalidad';

export interface Autor {
  id?: number;
  nombre: string;
  fechaNacimiento: Date;
  nacionalidad: Nacionalidad;
}