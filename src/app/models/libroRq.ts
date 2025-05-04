import { Autor } from "./autor";

export class LibroRq {
    titulo?: string;
    autor?: Autor;
    categoria?: string; 
    anioPublicacion?: number;
    existencias?: number;
}