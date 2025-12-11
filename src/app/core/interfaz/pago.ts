export interface IPagoRechazadoResponse {
  status: number;
  message: string;
  id: string;
  purchaseNumber: string;
  estadoPago: string;
  amount: number;
  authRaw: IAuthRawResponse;
}

export interface IAuthRawResponse {
  errorCode: number;
  errorMessage: string;
  header: IHeaderResponse;
  data: IDataSectionResponse;
}

export interface IHeaderResponse {
  ecoreTransactionUUID: string;
  ecoreTransactionDate: number;
  millis: number;
}

export interface IDataSectionResponse {
  YAPE_ID: string;
  CURRENCY: string;
  TERMINAL: string;
  TRANSACTION_DATE: string;
  ACTION_CODE: string;
  TRACE_NUMBER: string;
  CARD_TYPE: string;
  ECI_DESCRIPTION: string;
  ECI: string;
  SIGNATURE: string;
  CARD: string;
  MERCHANT: string;
  BRAND: string;
  STATUS: string;
  ACTION_DESCRIPTION: string;
  ADQUIRENTE: string;
  ID_UNICO: string;
  AMOUNT: string;
  PROCESS_CODE: string;
  TRANSACTION_ID: string;
}

//pago aprobado
export interface IPagoAprobadoResponse {
  status: number;
  message: string;
  idReserva: number;
  nombreAdministrado: string;
  tipoDocumento: string;
  numeroDocumento: string;
  celular: string;
  correo: string;
  codigoContribuyente: string;

  complejo: string;
  cancha: string;

  fechaReserva: string;        // "2025-12-04"
  cantidadHoras: number;
  montoTotal: number;

  idrecibo: number;
  numIngr: string;
  fecPago: string;             // "2025-12-04 08:26:59.0"

  purchaseNumber: string;
  estadoNiubiz: string;        // "APPROVED"
  tarifaHora: number;

  detallesJson: IDetalleReserva[];
}

export interface IDetalleReserva {
  idHorarioBase: number;
  rango: string;      // "08:00 am - 09:00 am"
  precio: number;
}