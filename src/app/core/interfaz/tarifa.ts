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

export interface IListarTarifaRequest {
  idComplejo?: number | null;
  idCancha?: number | null;
  diaSemana?: number | null;
  tipoHorario?: string | null;
  estado?: number | null;
  numeroPagina: number;
  totalPagina: number;
}

export interface IListarTarrifaResponse{
    "timestamp": string,
    "status": string,
    "message": string,
    "data":{
        "status":number;
        "message":string;
        "idTarifa":number;
        "idComplejo":number;
        "idCancha":number;
        "nombreComplejo":string;
        "nombreCancha":string;
        "diaSemana":number;
        "diaDescripcion":string;
        "turno":string;
        "turnoDescripcion":string;
        "rangoHorario":string;
        "precio":number;
        "tipoTasa":string;
        "codTasa":string;
        "estado":string;
        "estadoDescripcion":string;
        "fechaRegistro":string;
        "totalRegistros":number;
        "horaInicio":string;
        "horaFin":string;
    }[];
}


export interface IActualizarTarifaRequest {
    idTarifa:number;
    idCancha:number;
    diaSemana:number;
    tipoHorario:string;
    horaInicio:string;
    horaFin:string;
    precio:number;
    estado:number;
    codTasa:string;
    tipoTasa:string;
}