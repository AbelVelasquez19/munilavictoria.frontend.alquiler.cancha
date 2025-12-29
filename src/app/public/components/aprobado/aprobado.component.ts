import { DecimalPipe, NgIf, NgForOf, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxQrcodeStylingComponent, Options, DotType, CornerSquareType, CornerDotType } from 'ngx-qrcode-styling';
import { IPagoAprobadoResponse } from '../../../core/interfaz/pago';
import { Router } from '@angular/router';


@Component({
  selector: 'app-aprobado',
  standalone: true,
  imports: [DecimalPipe, NgIf, NgxQrcodeStylingComponent, NgForOf],
  templateUrl: './aprobado.component.html',
  styleUrl: './aprobado.component.css'
})
export class AprobadoComponent {
  @Input() visible: string = '';
  @Input() estado: string = '';
  @Input() token: string = '';
  @Input() dataPagoAprobado: IPagoAprobadoResponse | null = null;
  @Input() authRawJson: any;
  @Output() cerrar = new EventEmitter<void>();
  
  transcationDate: string = '';

  constructor(private router: Router) {}

  ngOnChanges() {
    if (this.authRawJson && this.authRawJson.dataMap && this.authRawJson.dataMap.TRANSACTION_DATE) {
      const timestamp = this.authRawJson.dataMap.TRANSACTION_DATE;
      this.transcationDate = this.formatFechaNiubiz(timestamp);    
    }
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

  public cerrarModal() {
    this.cerrar.emit();
    this.router.navigate(['/']);
    this.estado = '';
    this.token = '';
    this.dataPagoAprobado = null;
  }

  //qr

  qrConfig: Options = {
    width: 130,
    height: 130,
    type: 'svg',
    data: "http://172.16.201.248:4500/inicio?consulta="+this.token,
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
