import { DecimalPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IPagoRechazadoResponse } from '../../../core/interfaz/pago';

@Component({
  selector: 'app-rechazado',
  imports: [DecimalPipe,NgIf],
  templateUrl: './rechazado.component.html',
  styleUrl: './rechazado.component.css'
})
export class RechazadoComponent {
  @Input() visible: string = '';
  @Input() estado: string = '';
  @Input() token: string = '';
  @Input() dataPagoRechazado: IPagoRechazadoResponse | null = null;
  @Output() cerrar = new EventEmitter<void>();
  
  constructor(private router: Router) {}

  public cerrarModal() {
    this.cerrar.emit();
    this.router.navigate(['/']);
    this.estado = '';
    this.token = '';
    this.dataPagoRechazado = null;
  }
}
