import { Autor } from './autor';
import { Categoria } from './categoria'; // Asegúrate de importar Categoria

export class Libro {
  idLibro: number;
  titulo: string;
  autor: Autor;
  anioPublicacion: string;
  categoria: Categoria;  // Cambiado a tipo Categoria
  existencias: number;
  fechaNacimiento?: Date;
  fechaEntrega?: string;
}
