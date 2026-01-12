export interface IReservaRegistrarRequest{
    idAdministrado:number;
    idCancha:number;
    fecha:string;
    horarios:string; // ej. '1,2,3'
    montoTotal:number;
    cantidadHoras:number;
}

export interface IReservaRegistrarResponse{
    status:number;
    message:string;
    idReserva:number;
}

export interface IReservaCancelarRequest{
    opcion:number;
    idReserva:number;
}

export interface IReservaCancelarResponse{
    status:number;
    message:string;
}

export interface IReservaDetalleRequest{
    idReserva:number;
}

export interface IReservaDetalleResponse{
    status:number;
    message:string;
    idReserva:number;
    codigo:string;
    nombreAdministrado:string;
    tipoDocumento:string;
    numeroDocumento:string;
    celular:string;
    correo:string;
    complejo:string;
    cancha:string;
    fechaReserva:string;
    cantidadHoras:number;
    montoTotal:number;
    tarifaHora:number;
    detalles:{
        idHorarioBase:number;
        rango:string;
        precio:number;
    }[];
}

export interface IReservarLiberarReservaExpirdaResponse {
    status:number;
    message:string;
}

export interface IReservaGeneralResponse{
    status:number;
    message:string;
}

export interface IReservaTallerMasivoRequest{
    listaCanchas:string;
    listaFechas:string;
    horaInicio:string;
    horaFin:string;
}