export interface Complejo {
  idComplejo: number;
  nombre: string;
  direccion: string;
  imagen: string;
}

export interface IcomplejoRequest{
  opcion:number;  
}

export interface IComplejoResponse {
    status: string;
    message:string;
    timestamp: string;
    data:{
        idComplejo:number;
        nombre:string;
        imagen:string;
        direccion:string;
    }[],
}