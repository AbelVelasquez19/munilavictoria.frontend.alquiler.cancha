import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MessageComponent } from '../../../shared/message/message.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplejoAdminRequest, ComplejoAdminResponse } from '../../../core/interfaz/comAdmin';
import { ComplejoAdminSerivice } from '../../../core/service/comAdmin.service';
import { TarifaDetalleResponse } from '../../../core/interfaz/tarifa';

@Component({
  selector: 'app-generar-reserva',
  imports: [NgIf, MessageComponent, LoadingComponent, NgClass, FormsModule],
  templateUrl: './generar-reserva.component.html',
  styleUrl: './generar-reserva.component.css'
})
export class GenerarReservaComponent {
  @Input() abrirModal: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @ViewChild('msg') msg!: MessageComponent;
  @Output() registrado = new EventEmitter<void>();
  @Input() horarios: any[] = [];
  @Input() dataTarifas: TarifaDetalleResponse[] = [];
  @Input() totalPago: number = 0;

  constructor(private comAdminService: ComplejoAdminSerivice) { }

  isLoading: boolean = false;
  animarModal: boolean = false;

  tipoDocumento: string = '01';
  numeroDocumento: string = '';
  nombre: string = '';
  paterno: string = '';
  materno: string = '';
  telefono: string = '';
  correo: string = '';

  idAdministrado?: number = 0;

  maxLength: number = 8;
  cerrarModal() {
    this.animarModal = false;
    setTimeout(() => {
      this.cerrar.emit();
    }, 300);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abrirModal']) {
      if (this.abrirModal) {
        setTimeout(() => {
          this.animarModal = true;
        }, 10);
      } else {
        this.animarModal = false;
      }
    }
  }

  public onTipoDocumentoChange(): void {
    if (this.tipoDocumento === '01') {
      this.maxLength = 8;
    } else if (this.tipoDocumento === '04') {
      this.maxLength = 9;
    }
    if (this.numeroDocumento.length > this.maxLength) {
      this.numeroDocumento = this.numeroDocumento.slice(0, this.maxLength);
    }
    this.numeroDocumento = '';
  }

  public onNumeroDocumentoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/\D/g, '');
    input.value = sanitizedValue;
    this.numeroDocumento = sanitizedValue;

    if (input.value.length > this.maxLength) {
      input.value = input.value.slice(0, this.maxLength);
      this.numeroDocumento = input.value;
    }
  }

  public onNumeroTelefonoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/\D/g, '');
    input.value = sanitizedValue;
    this.telefono = sanitizedValue;

    if (input.value.length > 9) {
      input.value = input.value.slice(0, 9);
      this.telefono = input.value;
    }
  }

  public RegistrarComplejoAdmin() {
    this.isLoading = true;
    if (!this.validarCampos()) {
      this.isLoading = false;
      return;
    }
    const payload: ComplejoAdminRequest = {
      tipoPersona: '01',
      tipoDocumento: this.tipoDocumento,
      numeroDocumento: this.numeroDocumento,
      nombre: this.nombre,
      paterno: this.paterno,
      materno: this.materno,
      telefono: this.telefono,
      correo: this.correo,
      conAcepto: 1,
      conNoResonsabilizar: 1
    }
    this.comAdminService.registrarComplejoAdministrador(payload).subscribe({
      next: (response: ComplejoAdminResponse) => {
        this.isLoading = false;
        if (response.status !== 'success') {
          this.msg.show(response.message, 'error');
          return;
        }
        this.idAdministrado = response.data.idAdministrado;
        if (this.idAdministrado == undefined || this.idAdministrado == 0) {
          this.msg.show('El administrado no se ha registrado correctamente.', 'error');
          return;
        }
        /* this.registrarReserva(this.idAdministrado); */
      }, error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al registrar el administrador.', 'error');
      }
    });
  }

  private validarCampos(): boolean {

    if (this.tipoDocumento === '01') {
      if (this.numeroDocumento.length !== 8) {
        this.msg.show('El número de documento debe tener 8 caracteres para DNI.', 'warning');
        return false;
      }
    }

    if (this.tipoDocumento === '04') {
      if (this.numeroDocumento.length !== 9) {
        this.msg.show('El número de documento debe tener 9 caracteres para CE .', 'warning');
        return false;
      }
    }

    if (!this.numeroDocumento || !this.nombre || !this.paterno || !this.telefono || !this.correo) {
      this.msg.show('Por favor, complete todos los campos obligatorios.', 'warning');
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.correo)) {
      this.msg.show("Formato de correo electrónico inválido", "warning");
      return false;
    }

    return true;
  }

  horasSeleccionadas: any[] = [];

  public seleccionarHorario(slot: any) {
    console.log(slot);
    // Solo permitir si es disponible
    if (slot.estado !== 'disponible') {
      return;
    }

    // Si ya está seleccionado -> desmarcar
    /* if (slot.seleccionado) {
      slot.seleccionado = false;
      this.horasSeleccionadas = this.horasSeleccionadas.filter(h => h.id !== slot.id);
      //cuando deselecciono una hora, recalculo la tarifa, quitar de dataTarifa si la idHorarioBase coincide
      this.dataTarifa = this.dataTarifa.filter(d => d.idHorarioBase !== slot.id);
      this.totalPagar = this.dataTarifa.reduce((total, item) => total + item.precio, 0);
      return;
    } */

    // Validar máximo 2 horas
   /*  if (this.horasSeleccionadas.length >= 2) {
      this.msg.show("Solo puedes seleccionar máximo 2 horas por día.", "warning");
      return;
    } */

    // Seleccionar
    /* slot.seleccionado = true;
    this.horasSeleccionadas.push(slot);
    this.calcularTarifa(slot); */
  }


  /* 
    private registrarReserva(idAdministrado:number) {
      if (!this.validarCampoReserva()) {
        this.isLoading = false;
        return;
      }
      const horariosSeleccionadosIds = this.dataTarifa.map(d => d.idHorarioBase);
      const payload: IReservaRegistrarRequest = {
        idAdministrado: this.idAdministrado,
        idCancha: this.canchaSeleccionadaId,
        fecha: this.fechaReserva,
        horarios: horariosSeleccionadosIds.join(','),
        montoTotal: this.totalPagar,
        cantidadHoras: this.horasSeleccionadas.length
      };
  
      this.reservaService.registrarReserva(payload).subscribe({
        next: (response: IReservaRegistrarResponse) => {
          this.isLoading = false;
          if (response.status !== 1) {
            this.listarHorarios();
            this.horasSeleccionadas = [];
            this.totalPagar = 0;
            this.dataTarifa = [];
            this.msg.show(response.message, 'error');
            return;
          }
          this.idReserva = response.idReserva;
          this.detalleReserva(response.idReserva);
          this.generateSessionToken();
          this.pasoActivo = 3;
          this.footerDisabled = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.msg.show('Error al registrar la reserva.', 'error');
        }
      });
    } */

  /* private validarCampoReserva(): boolean {
    if (this.idAdministrado == 0) {
      this.msg.show('No existe administrado, cerrar la ventana y volver a reservar.', 'warning');
      return false;
    }
    if (this.canchaSeleccionadaId == 0) {
      this.msg.show('No existe cancha seleccionado.', 'warning');
      return false;
    }
    if (this.fechaReserva == '') {
      this.msg.show('No existe fecha de reserva.', 'warning');
      return false;
    }
    if (this.horasSeleccionadas.length == 0) {
      this.msg.show('No existe horarios seleccionados.', 'warning');
      return false;
    }
    return true; 
  } */
}
