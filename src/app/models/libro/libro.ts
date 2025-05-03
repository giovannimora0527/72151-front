import { Autor } from "../autor/autor";

export class Libro {
    idLibro: number;
    titulo: string;
    autor: Autor;
    anioPublicacion: string;
    categoria: string;
    existencias: string;
    fechaNacimiento?: Date;
}