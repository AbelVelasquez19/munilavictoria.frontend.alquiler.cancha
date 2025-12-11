export interface IListarAdminReservasRequest {
    fecha:string;
    idComplejo:number;
    idCancha:number;
}

export interface IListarAdminReservasResponse  {
    status: string;
    message:string;
    timestamp: string;
    data:{
        idEstadoCancha:number;
        fecha:string;
        idCancha:number;
        nombreCancha:string;
        nombreComplejo:string;
        idHorarioBase:number;
        rango:string;
        horaInicio:string;
        horaFin:string;
        estado:string;
        idReserva:number;
        montoTotal:string;
        idRecibo:number;
        estadoLetra:string;
        clienteNombre:string;
        clienteDocumento:string;
        estadoNiubiz:string;
        purchase_number:string;
        precioTarifa:number;
    }[],
}

export interface IHorarioMasivoRequest {
    idComplejo:number;
    listaCanchas:string;
    listaFechas:string;
    operador:string;
}

export interface IHorarioMasivoResponse {
    status: string;
    message:string;
    timestamp: string;
    data:{
        status:number;
        message:string;
    },
}