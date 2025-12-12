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
  imports: [FormsModule, NgClass, NgIf, NgFor, DecimalPipe, LoadingComponent, MessageComponent, GenerarHorariosComponent],
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

  constructor(
    private complejoAdminReservaService: ComplejoAdminReservaSerivice,
    private complejoService: ComplejoService,
    private canchaService: CanchasService
  ) { }

  ngOnInit() {
    this.cargarComplejos();
  }

  listarReservasDeportivas() {
    this.isLoading = true;
    const payload: IListarAdminReservasRequest = {
      fecha: this.fechaSeleccionada,
      idComplejo: Number(this.idComplejo),
      idCancha: Number(this.idCancha)
    };

    this.complejoAdminReservaService.listarReservasDeportivos(payload).subscribe({
      next: (resp: IListarAdminReservasResponse) => {
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
  }

  abrirModalGenerarHorarios: boolean = false;
  
  public abrirModalGenerarHorariosFunc() {
    this.abrirModalGenerarHorarios = true;
  }
  public cerrarModalGenerarHorarios() {
    this.abrirModalGenerarHorarios = false;
  }

  nuevoEstado: string = '';
  public cambiarEstadoHorario(idEstadoCancha: number, estado: string) {
    this.isLoading = true;
    if(idEstadoCancha == 0 || idEstadoCancha == null){
      this.msg.show('ID de estado de cancha inválido', 'error');
      return;
    }
    if(estado == 'T'){
      this.nuevoEstado = 'D';
    }
    if(estado == 'D'){
      this.nuevoEstado = 'T';
    }
    const payload:ICambiarEstadoHorarioRequest = {
      idEstadoCancha: idEstadoCancha,
      nuevoEstado: this.nuevoEstado,
      operador:'COMPLEJO ADMIN'
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

}
