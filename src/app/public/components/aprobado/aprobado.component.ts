import { DecimalPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgxQrcodeStylingComponent, Options, DotType, CornerSquareType, CornerDotType } from 'ngx-qrcode-styling';


@Component({
  selector: 'app-aprobado',
  standalone: true,
  imports: [DecimalPipe, NgIf, NgxQrcodeStylingComponent],
  templateUrl: './aprobado.component.html',
  styleUrl: './aprobado.component.css'
})
export class AprobadoComponent {
  // Para mostrar el modal
  VisaStatus: number = 1;

  // Datos del pago confirmado
  purchaseNumber: string = '1039165';
  fechaOperacion: string = '2025-12-02 15:48';

  // Datos del responsable
  nombreCompleto: string = 'VELASQUEZ VILLAFRANCA PRIMITIVO ABEL';
  dni: string = '62126949';
  celular: string = '922355307';

  // Datos de reserva
  canchaNombre: string = 'Complejo Inca Garcilaso – Cancha 1';
  canchaTipo: string = 'Loza deportiva';
  fechaReserva: string = '2025-12-02';
  horaInicio: string = '13:00';
  horaFin: string = '14:00';

  // Códigos
  codigoReserva: string = '1644050';
  totalPagado: number = 15.00;

  constructor() { }

  // Cerrar el modal
  cerrarModal() {
    this.VisaStatus = 0; // Ocultar modal
  }

  //qr

  qrConfig: Options = {
    width: 130,
    height: 130,
    type: 'svg',
    data: this.codigoReserva,
    image: undefined,

    dotsOptions: {
      type: "rounded",
      color: "#000000",
    },

    cornersSquareOptions: {
      type: "dot",
      color: "#000000",
    },

    cornersDotOptions: {
      type: "dot",
      color: "#000000",
    },

    backgroundOptions: {
      color: "#ffffff"
    }
  };
}
