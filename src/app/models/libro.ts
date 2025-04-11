import { Autor } from "./autor";

export class Libro {
    idLibro: number;
    titulo: string;
    autor: Autor;
    anioPublicacion?: number;
    categoria?: string;
    existencias: number;    
}