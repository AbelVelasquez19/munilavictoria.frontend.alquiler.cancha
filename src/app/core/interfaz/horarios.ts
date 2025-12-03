export interface IDHorariosRequest {
    idCancha:number;  
    fecha:string;
}

export interface IHorariosResponse {
    status: string;
    message:string;
    timestamp: string;
    data:{
        status:number;
        message:string;
        idHorarioBase:number;
        rango:string;
        estado:string;
    }[],
}

export interface HorarioSlot {
    id: number;
    rango: string;
    estado: 'disponible' | 'reservado' | 'taller';
    seleccionado: true | false;
  }