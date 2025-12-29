import { Component, ViewChild } from '@angular/core';
import { MessageComponent } from '../../shared/message/message.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TarifaService } from '../../core/service/tarifa';
import { IListarTarifaRequest, IListarTarrifaResponse } from '../../core/interfaz/tarifa';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RegistrarTarifaComponent } from "../components/registrar-tarifa/registrar-tarifa.component";
import { FormsModule } from '@angular/forms';
import { IcomplejoRequest, IComplejoResponse } from '../../core/interfaz/Complejo';
import { ComplejoService } from '../../core/service/complejo.service';
import { ICanchasRequest, ICanchasResponse } from '../../core/interfaz/canchas';
import { CanchasService } from '../../core/service/canchas.service';


@Component({
  selector: 'app-tarifa',
  imports: [MessageComponent, LoadingComponent, NgIf, NgFor, NgClass, RegistrarTarifaComponent, FormsModule],
  templateUrl: './tarifa.component.html',
  styleUrl: './tarifa.component.css'
})
export class TarifaComponent {
  @ViewChild('msg') msg!: MessageComponent;
  isLoading: boolean = false;

  dataListaTarifa: IListarTarrifaResponse = {} as IListarTarrifaResponse;
  dataMostrarTarifa: any[] = [];

  paginaActual = 1;
  registrosPorPagina = 10;
  totalRegistros = 0;
  totalPaginas = 0;

  maxPaginasVisibles = 7;
  paginasVisibles: number[] = [];

  abrirModalRegistrarTarifa: boolean = false;

  filtroIdComplejo: number  | null = null ;
  filtroIdCancha: number  | null = null;
  filtroDiaSemana: number | null = null;
  filtroTipoHorario: string | null = null;
  filtroEstado: number | null = null;

  dataComplejos: IComplejoResponse = {} as IComplejoResponse;
  dataCanchas: ICanchasResponse = {} as ICanchasResponse;

  constructor(
    private tarifaService: TarifaService,
    private complejoService: ComplejoService,
    private canchaService: CanchasService,
  ) { }

  ngOnInit() {
    this.listarTarifas();
    this.cargarComplejos();
  }

  cerrarModalRegistrarTarifa() {
    this.abrirModalRegistrarTarifa = false;
  }

  abrirModal() {
    this.abrirModalRegistrarTarifa = true;
  }

  get desdeRegistro(): number {
    return (this.paginaActual - 1) * this.registrosPorPagina + 1;
  }

  get hastaRegistro(): number {
    return Math.min(
      this.paginaActual * this.registrosPorPagina,
      this.totalRegistros
    );
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.listarTarifas();
  }

  private calcularPaginasVisibles(): void {
    const total = this.totalPaginas;
    const actual = this.paginaActual;
    const max = this.maxPaginasVisibles;

    if (total <= max) {
      this.paginasVisibles = Array.from({ length: total }, (_, i) => i + 1);
      return;
    }

    let inicio = Math.max(actual - Math.floor(max / 2), 1);
    let fin = inicio + max - 1;

    if (fin > total) {
      fin = total;
      inicio = fin - max + 1;
    }

    this.paginasVisibles = [];
    for (let i = inicio; i <= fin; i++) {
      this.paginasVisibles.push(i);
    }
  }


  listarTarifas() {
    this.isLoading = true;

    const payload: IListarTarifaRequest = {
      idComplejo: this.filtroIdComplejo || null,
      idCancha: this.filtroIdCancha || null,
      diaSemana: this.filtroDiaSemana ?? null,
      tipoHorario: this.filtroTipoHorario || null,
      estado: this.filtroEstado ?? null,

      numeroPagina: this.paginaActual,
      totalPagina: this.registrosPorPagina
    };

    this.tarifaService.listarTarifa(payload).subscribe({
      next: (resp: IListarTarrifaResponse) => {
        this.isLoading = false;

        if (resp.status !== 'success') {
          this.msg.show(resp.message || 'Error al listar tarifas', 'error');
          return;
        }

        this.dataListaTarifa = resp;
        this.totalRegistros = resp.data?.[0]?.totalRegistros ?? 0;
        this.totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);

        this.calcularPaginasVisibles();
      },
      error: () => {
        this.isLoading = false;
        this.msg.show('Error de comunicación con el servidor', 'error');
      }
    });
  }

  buscarTarifa() {
    this.paginaActual = 1;
    this.listarTarifas();
  }

  public actualizarEstadoTarifa(idTarifa: number, estado: number) {
    this.isLoading = true;
    this.tarifaService.actualizarEstadoTarifa(idTarifa, estado).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if (resp.status !== 'success') {
          this.msg.show('Error al actualizar el estado de la tarifa', 'error');
          return;
        }
        //this.msg.show('Estado de la tarifa actualizado correctamente', 'success');
        this.listarTarifas();
      },
      error: (err) => {
        this.isLoading = false;
        this.msg.show('Error al actualizar el estado de la tarifa', 'error');
      }
    });
  }

  abrirModalEditarTarifa(idTarifa: number) {
    this.abrirModalRegistrarTarifa = true;
    this.dataMostrarTarifa = this.dataListaTarifa.data.filter(item => item.idTarifa === idTarifa);
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
      this.filtroIdComplejo = event.target.value;
      this.filtroIdCancha = 0;
      this.listarCanchasPorComplejo(Number(this.filtroIdComplejo));
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

    public onTallerRegistrado() {
      this.listarTarifas();
      this.abrirModalRegistrarTarifa = false;
      this.paginaActual = 1;
    }
}
