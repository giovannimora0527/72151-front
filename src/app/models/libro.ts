import { Autor } from "./autor";
<<<<<<< HEAD
import { Categoria } from "./categoria";

export class Libro {
    idLibro: number;
    titulo: string;
    autor: Autor;
    anioPublicacion?: number;
    categoria?: Categoria;
    existencias: number;    
=======

export class Libro {
    idLibro?: number;
    titulo: string;
    autor: Autor;
    anioPublicacion: number;
    categoria: string;
    existencias: number;
>>>>>>> 1b362df161768992ba20c39c95b5c1cb059cbca2
}