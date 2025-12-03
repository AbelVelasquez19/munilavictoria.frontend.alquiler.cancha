import { DecimalPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-rechazado',
  imports: [DecimalPipe,NgIf],
  templateUrl: './rechazado.component.html',
  styleUrl: './rechazado.component.css'
})
export class RechazadoComponent {
  // Para mostrar el modal
  VisaStatus: number = 2;

  // Datos generales del intento de pago
  purchaseNumber: string = '1039165';
  fechaOperacion: string = '2025-12-02 15:50';
  totalPagado: number = 15.00;

  // Motivo del rechazo (del backend Niubiz)
  motivoRechazo: string = 'Not Authorized';
  visaCodigo: string = '400';
  visaAutorizacion: string = '000000';
  visaTraza: string = '8f4af95f-f6b6-42d5-9ffb-43e1...';

  constructor() {}

  cerrarModal() {
    this.VisaStatus = 0;
  }

  // Acción para reintentar pago
  reintentarPago() {
    // Aquí redireccionas al módulo donde se inicia el checkout
    window.location.href = '/dashboard/estado-cuenta';
  }
}
