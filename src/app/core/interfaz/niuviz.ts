import { IReservaDetalleResponse } from "./reserva";

export interface INumeroCompra {
    id:number;
    purchaseNumber:string;
    nombreDeComercio:string;
    codigoDeComercio:string;
    fechaCreacion:string;
    observacion:string;
}

export interface LogVisa {
  tramo: string;
  purchase_number: string;
  channel: 'web';
  navegador: string;
  url: string;
  estacion?: string;
  visa_url: string;
  visa_merchant_id: string;
  sesion_visa: string;
  data:{},
  resumen: {
    codigo: string;
    amount: number;
    total_deuda: number;
    total_descuento: number;
    criterio: string;
    cantidad_recibos: number;
  };
  detalle: IReservaDetalleResponse | any[];
}