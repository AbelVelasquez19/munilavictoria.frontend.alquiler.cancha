import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-procesar-pago',
  imports: [NgIf],
  templateUrl: './error-procesar-pago.component.html',
  styleUrl: './error-procesar-pago.component.css'
})
export class ErrorProcesarPagoComponent {
  @Input() visibleError: string = '';
  @Output() cerrar = new EventEmitter<void>();

  constructor(private router: Router) { }

  reintentarPago() {

  }

  cerrarModalError() {
    this.cerrar.emit();
    this.router.navigate(['/']);
  }
}
