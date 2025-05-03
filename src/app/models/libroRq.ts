export class LibroRq {
  id?: number;
  titulo: string;
  anioPublicacion: string;
  autorId: number;
  categoriaId: number;
  existencias: number;

  constructor(
    titulo: string, // Se mantiene como string
    anioPublicacion: string,
    autorId: number,
    categoriaId: number,
    existencias: number,
    id?: number // Se mantiene opcional al final
  ) {
    this.titulo = titulo;
    this.anioPublicacion = anioPublicacion;
    this.autorId = autorId;
    this.categoriaId = categoriaId;
    this.existencias = existencias;
    this.id = id;
  }
}