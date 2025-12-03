export interface ComplejoAdminRequest {
  tipoPersona:string;
  tipoDocumento:string;
  numeroDocumento:string;
  nombre:string;
  paterno:string;
  materno:string;
  telefono:string;
  correo:string;
  conAcepto:number;
  conNoResonsabilizar:number;
}

export interface ComplejoAdminResponse {
    status: string;
    message:string;
    timestamp: string;
    data:{
        idAdministrado:number;
        message:string;
        errorDetails:string;
    },
}