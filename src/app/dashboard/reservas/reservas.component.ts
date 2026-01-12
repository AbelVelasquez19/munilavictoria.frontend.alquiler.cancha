import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICambiarEstadoHorarioRequest, ICambiarEstadoHorarioResponse, IListarAdminReservasRequest, IListarAdminReservasResponse } from '../../core/interfaz/comAdminReservas';
import { ComplejoAdminReservaSerivice } from '../../core/service/comAdminReservas';
import { IcomplejoRequest, IComplejoResponse } from '../../core/interfaz/Complejo';
import { ComplejoService } from '../../core/service/complejo.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MessageComponent } from '../../shared/message/message.component';
import { ICanchasRequest, ICanchasResponse } from '../../core/interfaz/canchas';
import { CanchasService } from '../../core/service/canchas.service';
import { GenerarHorariosComponent } from '../components/generar-horarios/generar-horarios.component';
import { IReservarLiberarReservaExpirdaResponse } from '../../core/interfaz/reserva';
import { ReservaService } from '../../core/service/reserva.service';
import { GenerarReservaComponent } from '../components/generar-reserva/generar-reserva.component';
import { ITarifaRequest, ITarifaResponse, TarifaDetalleResponse } from '../../core/interfaz/tarifa';
import { TarifaService } from '../../core/service/tarifa';
import { GenerarTallerComponent } from "../components/generar-taller/generar-taller.component";

export interface HorarioReserva {
  rango: string;
  estado: 'DISPONIBLE' | 'RESERVADO' | 'PENDIENTE' | 'RECHAZADO';
  usuario?: string;
  cancha: string;
  idReserva?: number;
}


export interface Cancha {
  idCancha: number;
  idComplejo: number;
  nombre: string;
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf, NgFor, DecimalPipe, LoadingComponent, MessageComponent, GenerarHorariosComponent, GenerarReservaComponent, GenerarTallerComponent],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent {
  @ViewChild('msg') msg!: MessageComponent;
  isLoading: boolean = false;

  fechaSeleccionada: string = "";
  idComplejo: number = 0;
  idCancha: number = 0;

  dataComplejos: IComplejoResponse = {} as IComplejoResponse;
  dataCanchas: ICanchasResponse = {} as ICanchasResponse;
  horarios: HorarioReserva[] = [];

  dataListaReserva: IListarAdminReservasResponse = {} as IListarAdminReservasResponse;

  abrirModalGenerarReserva: boolean = false;
  abrirModalGenerarTaller: boolean = false;

  horarioSeleccionado: any[] = [];
  dataTarifa: TarifaDetalleResponse[] = [];
  totalPagar: number = 0;

  constructor(
    private complejoAdminReservaService: ComplejoAdminReservaSerivice,
    private complejoService: ComplejoService,
    private canchaService: CanchasService,
    private reservaService: ReservaService,
    private tarifaService:TarifaService
  ) { }

  ngOnInit() {
    this.cargarComplejos();
  }

  listarReservasDeportivas() {
    this.liberarReservaExpirada();
    this.isLoading = true;
    const payload: IListarAdminReservasRequest = {
      fecha: this.fechaSeleccionada,
      idComplejo: Number(this.idComplejo),
      idCancha: Number(this.idCancha)
    };

    this.complejoAdminReservaService.listarReservasDeportivos(payload).subscribe({
      next: (resp: IListarAdminReservasResponse) => {
        console.log(resp);
        this.isLoading = false;
        if (resp.status !== 'success') {
          this.msg.show('Error al listar reservas deportivas', 'error');
          return;
        }
        this.dataListaReserva = resp;
      },
      error: (err) => {
        this.isLoading = false;
        this.msg.show('Error al listar reservas deportivas', 'error');
      }
    });
  }

  private cargarComplejos() {
    this.isLoading = true;
    const payload: IcomplejoRequest = {
      opcion: 1
    }
    this.complejoService.listarComepljos(payload).subscribe({
      next: (resp) => {
        this.isLoading = false;
        if (resp.status !== 'success') {
          this.msg.show('Error al cargar complejos', 'error');
          return;
        }
        this.dataComplejos = resp;
      },
      error: (err) => {
        this.isLoading = false;
        this.msg.show('Error al cargar complejos', 'error');
      }
    });
  }

  public onChangeComplejo(event: any) {
    this.idComplejo = event.target.value;
    this.idCancha = 0;
    this.listarCanchasPorComplejo(Number(this.idComplejo));
  }

  private listarCanchasPorComplejo(idComplejo: number) {
    this.isLoading = true;
    const payload: ICanchasRequest = {
      opcion: 1,
      idComplejo: idComplejo
    };
    this.canchaService.listarCanchas(payload).subscribe({
      next: (resp: ICanchasResponse) => {
        this.isLoading = false;
        if (resp.status !== 'success') {
          this.msg.show('Error al cargar canchas', 'error');
          return;
        }
        this.dataCanchas = resp;
      },
      error: (err) => {
        this.isLoading = false;
        this.msg.show('Error al cargar canchas', 'error');
      }
    });
  }

  public buscarReservas() {
    this.listarReservasDeportivas();
    this.horarioSeleccionado = [];
    this.dataTarifa = [];
    this.totalPagar = 0;
  }

  abrirModalGenerarHorarios: boolean = false;

  public abrirModalGenerarHorariosFunc() {
    this.abrirModalGenerarHorarios = true;
  }

  public abrirModalGenerarReservaFunc() {
    if (this.horarioSeleccionado.length === 0) {
      this.msg.show('Seleccione al menos un horario para generar la reserva.', 'warning');
      return;
    }
    this.abrirModalGenerarReserva = true;
  }

  public abrirModalTallerMasivoFunc() {
    this.abrirModalGenerarTaller = true;
  }

  public cerrarModalGenerarHorarios() {
    this.abrirModalGenerarHorarios = false;
  }

  public cerrarModalGenerarReserva() {
    this.abrirModalGenerarReserva = false;
  }

  public cerrarModalGenerarTaller() {
    this.abrirModalGenerarTaller = false;
  }

  nuevoEstado: string = '';
  public cambiarEstadoHorario(idEstadoCancha: number, estado: string) {
    this.isLoading = true;
    if (idEstadoCancha == 0 || idEstadoCancha == null) {
      this.msg.show('ID de estado de cancha inválido', 'error');
      return;
    }
    if (estado == 'T') {
      this.nuevoEstado = 'D';
    }
    if (estado == 'D') {
      this.nuevoEstado = 'T';
    }
    const payload: ICambiarEstadoHorarioRequest = {
      idEstadoCancha: idEstadoCancha,
      nuevoEstado: this.nuevoEstado,
      operador: 'COMPLEJO ADMIN'
    };

    this.complejoAdminReservaService.cambiarEstadoHorario(payload).subscribe({
      next: (resp: ICambiarEstadoHorarioResponse) => {
        this.isLoading = false;
        if (resp.status !== 'success') {
          this.msg.show('Error al cambiar estado del horario', 'error');
          return;
        }
        /* this.msg.show('Estado del horario cambiado correctamente', 'success'); */
        this.listarReservasDeportivas();
      },
      error: (err) => {
        this.isLoading = false;
        this.msg.show('Error al cambiar estado del horario', 'error');
      }
    });

  }

  public liberarReservaExpirada() {
    this.reservaService.liberarReservaExpirada().subscribe({
      next: (response: IReservarLiberarReservaExpirdaResponse) => {
        if (response.status !== 1) {
          return;
        }
      },
      error: (error) => {
        console.error('Error al liberar reservas expiradas:', error);
      }
    });
  }

  public seleccionarHorario(slot: any) {
    if (slot.estado !== 'D') {
      return;
    }
    const index = this.horarioSeleccionado.findIndex(
      h => h.idHorarioBase === slot.idHorarioBase
    );

    if (index > -1) {
      this.horarioSeleccionado.splice(index, 1);
      
      this.dataTarifa = this.dataTarifa.filter(d => d.idHorarioBase !== slot.idHorarioBase);
      this.totalPagar = this.dataTarifa.reduce((total, item) => total + item.precio, 0);
      
      slot.seleccionado = false;
    } else {
      const horario = {
        idHorarioBase: slot.idHorarioBase,
        estado: slot.estado,
        rango: slot.rango,
        seleccionado: true
      };
      this.horarioSeleccionado.push(horario);
      slot.seleccionado = true;

      this.calcularTarifa(horario);
    }
  }

  public calcularTarifa(slot: any) {
    if (this.idCancha == 0) {
      this.msg.show('Seleccione una cancha.', 'warning');
      return;
    }
    if (this.fechaSeleccionada === '') {
      this.msg.show('Seleccione una fecha de reserva.', 'warning');
      return;
    }
    if (this.horarioSeleccionado.length === 0) {
      this.msg.show('Seleccione al menos un horario.', 'warning');
      return;
    }
    const payload: ITarifaRequest = {
      idCancha: this.idCancha,
      fecha: this.fechaSeleccionada,
      horarios: slot.idHorarioBase.toString()
    };
    this.isLoading = true;
    this.tarifaService.calcularTarifa(payload).subscribe({
      next: (response: ITarifaResponse) => {
        this.isLoading = false;
        if (response.status == 0) {
          this.msg.show(response.message, 'warning');
          slot.seleccionado = false;
          this.horarioSeleccionado = this.horarioSeleccionado.filter(h => h.idHorarioBase !== slot.idHorarioBase);
          return;
        }
        this.agregarDatataTarifa(response.detalles);
      },
      error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al calcular la tarifa.', 'error');
      }
    });
  }

  private agregarDatataTarifa(nuevaData: TarifaDetalleResponse[]) {
    this.dataTarifa = [...this.dataTarifa, ...nuevaData];
    this.totalPagar = this.dataTarifa.reduce((total, item) => total + item.precio, 0);
  }

}
