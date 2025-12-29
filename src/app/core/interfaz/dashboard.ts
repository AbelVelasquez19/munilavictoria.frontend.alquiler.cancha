export interface DashboardIngresosResponse {
    status: string;
    message:string;
    timestamp: string;
    data:{
        ingresosDia:number;
        ingresosMes:number;
        reservasDia:number;
        pagosRechazados:number;
        mes:string;
        nombreMes:string;
        total:number;
        rango:string;
        totalReservas:number;
        cancha:string;
        totalCancha:number;

        idReserva:number;
        fechaPago:string;
        montoTotal:number;
        nombreCancha:string;
        complejo:string;
        operador:string;
        estacion:string;

        dia:string;
        totalPicos:number;
        horarioPico:string;
        montoPico:number;

        nombreCanchaPico:string;
        totalCanchaPico:number;
    }[],
}