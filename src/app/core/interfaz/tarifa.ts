export interface ITarifaRequest {
    idCancha:number;
    fecha:string;
    horarios:string;
}

export interface ITarifaResponse {
    status:number;
    message:string;
    totalPagar:number;
    horasSeleccionadas:string;
    detalles: {
        idHorarioBase:number;
        rango:number;
        precio:number;
        codTasa:string;
    }[];
}

export interface TarifaDetalleResponse {
    idHorarioBase:number;
    rango:number;
    precio:number;
    codTasa:string;
}[];