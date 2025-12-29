import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MessageComponent } from '../../../shared/message/message.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { IcomplejoRequest, IComplejoResponse } from '../../../core/interfaz/Complejo';
import { ICanchasRequest, ICanchasResponse } from '../../../core/interfaz/canchas';
import { ComplejoService } from '../../../core/service/complejo.service';
import { CanchasService } from '../../../core/service/canchas.service';
import { TarifaService } from '../../../core/service/tarifa';
import { IActualizarTarifaRequest } from '../../../core/interfaz/tarifa';

@Component({
  selector: 'app-registrar-tarifa',
  imports: [NgIf, LoadingComponent, MessageComponent, NgClass, FormsModule, NgFor],
  templateUrl: './registrar-tarifa.component.html',
  styleUrl: './registrar-tarifa.component.css'
})
export class RegistrarTarifaComponent {
  @Input() abrirModal: boolean = true;
  @Output() cerrar = new EventEmitter<void>();
  @Output() registrado = new EventEmitter<void>();
  @ViewChild('msg') msg!: MessageComponent;
  @Input() dataTarifa: any[] = [];

  constructor(
    private complejoService: ComplejoService,
    private canchaService: CanchasService,
    private tarifaService: TarifaService
  ) { }

  isLoading: boolean = false;
  animarModal: boolean = false;

  form: any = {
    idCancha: 0,
    idComplejo: 0,
    diaSemana: '',
    turno: 'D',
    horaInicio: '',
    horaFin: '',
    precio: '',
    codTasa: '',
    tipoTasa: '',
    estado: true
  };

  dataComplejos: IComplejoResponse = {} as IComplejoResponse;
  dataCanchas: ICanchasResponse = {} as ICanchasResponse;
  idComplejo: number = 0;
  idCancha: number = 0;
  idTarifa: number = 0;

  ngOnInit() {
    this.cargarComplejos();
  }

  cerrarModal() {
    this.animarModal = false;
    setTimeout(() => {
      this.cerrar.emit();
    }, 300);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abrirModal'] && changes['abrirModal'].currentValue) {
      setTimeout(() => {
        this.animarModal = true;
      }, 10);
    }

    if (changes['dataTarifa']) {
      this.cargarTrifa();
      this.listarCanchasPorComplejo(this.idComplejo);
    }
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

  private cargarTrifa() {
    if (this.dataTarifa && this.dataTarifa.length > 0) {
      const tarifa = this.dataTarifa[0];
      this.form = {
        idCancha: tarifa.idCancha,
        idComplejo: tarifa.idComplejo,
        diaSemana: tarifa.diaSemana,
        turno: tarifa.turno,
        //convertir en hora formato HH:MM
        horaInicio: new Date(`1970-01-01T${tarifa.horaInicio}Z`).toISOString().substring(11, 16),
        horaFin: new Date(`1970-01-01T${tarifa.horaFin}Z`).toISOString().substring(11, 16),   
        precio: tarifa.precio,
        codTasa: tarifa.codTasa,
        tipoTasa: tarifa.tipoTasa,
        estado: tarifa.estado === '1'
      };
      this.idComplejo = tarifa.idComplejo;
      this.idCancha = tarifa.idCancha;
      this.idTarifa = tarifa.idTarifa;
    } 
  }

  public registrarActualizarTarifa(){
    const payload:IActualizarTarifaRequest = {
      idTarifa: this.idTarifa,
      idCancha: this.form.idCancha,
      diaSemana: Number(this.form.diaSemana),
      tipoHorario: this.form.turno,
      horaInicio: this.form.horaInicio,
      horaFin: this.form.horaFin,
      precio: Number(this.form.precio),
      codTasa: this.form.codTasa,
      tipoTasa: this.form.tipoTasa,
      estado: this.form.estado ? 1 : 0
    };
    this.tarifaService.actualizarTarifa(payload).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.msg.show('Tarifa actualizada correctamente', 'success');
          this.registrado.emit();
        } else {
          this.msg.show('Error al actualizar tarifa', 'error');
        }
      },
      error: (err) => {
        this.msg.show('Error al actualizar tarifa', 'error');
      }
    });
  }

}
