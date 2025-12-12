import { DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IPagoRechazadoResponse } from '../../../core/interfaz/pago';

@Component({
  selector: 'app-rechazado',
  imports: [DecimalPipe, NgIf],
  templateUrl: './rechazado.component.html',
  styleUrl: './rechazado.component.css'
})
export class RechazadoComponent {
  @Input() visible: string = '';
  @Input() estado: string = '';
  @Input() token: string = '';
  @Input() dataPagoRechazado: IPagoRechazadoResponse | null = null;
  @Output() cerrar = new EventEmitter<void>();

  constructor(private router: Router) { }

  public cerrarModal() {
    this.cerrar.emit();
    this.router.navigate(['/']);
    this.estado = '';
    this.token = '';
    this.dataPagoRechazado = null;
  }

  formatFechaNiubiz(fecha: string | undefined): string {
    if (!fecha) return '';

    const year = '20' + fecha.substring(0, 2);
    const month = fecha.substring(2, 4);       
    const day = fecha.substring(4, 6);        
    const hour = fecha.substring(6, 8);     
    const minute = fecha.substring(8, 10);   
    const second = fecha.substring(10, 12); 

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }


}
