export interface dataCanchas{
    idCancha:number;
    idComplejo:number;
    nombre:string;
    descripcion:string;
    estado:number;
}

export interface ICanchasRequest{
  opcion:number;
  idComplejo:number;  
}

export interface ICanchasResponse {
    status: string;
    message:string;
    timestamp: string;
    data:{
        idCancha:number;
        idComplejo:number;
        nombre:string;
        descripcion:string;
        estado:number;
    }[],
}