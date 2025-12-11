export interface ILoginResponse {
  status: string;
  message: string;
  data: {
    numDoc: string;
    nombres: string;
    paterno: string | null;
    materno: string;
    token: string;
  };
  timestamp: string;
}