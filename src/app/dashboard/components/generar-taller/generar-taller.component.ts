import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MessageComponent } from '../../../shared/message/message.component';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { ComplejoService } from '../../../core/service/complejo.service';
import { CanchasService } from '../../../core/service/canchas.service';
import { IcomplejoRequest, IComplejoResponse } from '../../../core/interfaz/Complejo';
import { ICanchasRequest } from '../../../core/interfaz/canchas';
import { ReservaService } from '../../../core/service/reserva.service';
import { IReservaGeneralResponse, IReservaTallerMasivoRequest } from '../../../core/interfaz/reserva';

@Component({
  selector: 'app-generar-taller',
  imports: [NgIf, MessageComponent, LoadingComponent, FormsModule, DatePipe, NgFor, NgClass],
  templateUrl: './generar-taller.component.html',
  styleUrl: './generar-taller.component.css'
})
export class GenerarTallerComponent {
  @Input() abrirModal: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @ViewChild('msg') msg!: MessageComponent;

  isLoading: boolean = false;
  isAllSelected: boolean = false;

  // FORM DATA
  idComplejo: number = 0;
  complejos: any[] = [];
  canchas: any[] = [];

  // Selecciones
  listaFechas: string[] = [];
  canchasSeleccionadas: any[] = [];
  complejoSeleccionado: any = null;

  // CALENDARIO
  nombreMes = '';
  anioActual = 0;
  mesActual = 0;
  diasDelMes: any[] = [];

  // RANGO HORARIO (ejemplo, podrías reemplazar al integrar)
  rangoHoraInicio: string = "08:00";
  rangoHoraFin: string = "23:00";
  duracionBloque: number = 60;

  // Cálculos
  cantidadBloquesPorDia: number = 0;
  totalCombinaciones: number = 0;
  totalHorariosFinal: number = 0;


  constructor(
    private complejoService: ComplejoService,
    private srvCancha: CanchasService,
    private reservaServicio: ReservaService
  ) { }

  cerrarModal() {
    this.cerrar.emit();
    this.isAllSelected = false;
    this.listaFechas = [];
    this.actualizarVistaPrevia();
  }

  // INIT
  ngOnInit() {
    const hoy = new Date();
    this.mesActual = hoy.getMonth();
    this.anioActual = hoy.getFullYear();

    this.generarCalendario();
    this.cargarComplejos();
    this.establecerRangoDeFechas();
  }


  // CARGA DE COMPLEJOS
  cargarComplejos() {
    const payload: IcomplejoRequest = { opcion: 1 };

    this.complejoService.listarComepljos(payload).subscribe({
      next: (res: IComplejoResponse) => {
        this.complejos = res.data ?? res;
      },
      error: () => this.msg.show('Error cargando complejos', 'error')
    });
  }

  // CARGA DE CANCHAS
  cargarCanchas() {
    if (!this.idComplejo) {
      this.canchas = [];
      this.actualizarVistaPrevia();
      return;
    }

    const payload: ICanchasRequest = {
      opcion: 1,
      idComplejo: this.idComplejo
    };

    this.srvCancha.listarCanchas(payload).subscribe({
      next: (res) => {
        this.canchas = (res.data ?? res).map((c: any) => ({
          ...c,
          selected: false
        }));
        this.actualizarVistaPrevia();
      },
      error: () => this.msg.show('Error cargando canchas', 'error')
    });
  }

  // CALENDARIO MULTI-SELECT
  generarCalendario() {
    const fecha = new Date(this.anioActual, this.mesActual, 1);
    const primerDiaSemana = fecha.getDay();
    const diasEnMes = new Date(this.anioActual, this.mesActual + 1, 0).getDate();

    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    this.nombreMes = nombresMeses[this.mesActual];

    const dias = [];

    // Espacios en blanco
    for (let i = 0; i < primerDiaSemana; i++) {
      dias.push({ dia: '', esDelMes: false });
    }

    // Días reales del mes
    for (let d = 1; d <= diasEnMes; d++) {
      const fechaISO = `${this.anioActual}-${String(this.mesActual + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      dias.push({
        dia: d,
        fechaISO,
        esDelMes: true
      });
    }

    this.diasDelMes = dias;
  }

  //VALIDAR  RANGO DE FECHAS SELECCIONABLES
  minDate: string = '';
  maxDate: string = '';

  private establecerRangoDeFechas() {
    const hoy = new Date();

    const inicioMes = new Date(this.anioActual, this.mesActual, 1);
    const finMes = new Date(this.anioActual, this.mesActual + 1, 0);

    // Si es el mes actual
    if (
      this.mesActual === hoy.getMonth() &&
      this.anioActual === hoy.getFullYear()
    ) {
      this.minDate = hoy.toISOString().split('T')[0];
      this.maxDate = finMes.toISOString().split('T')[0];
    } else {
      // Mes futuro (todo el mes) 
      this.minDate = inicioMes.toISOString().split('T')[0];
      this.maxDate = finMes.toISOString().split('T')[0];
    }

    console.log('RANGO:', this.minDate, this.maxDate);
  }
  
  prevMonth() {
    this.mesActual--;
    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    }
    this.generarCalendario();
    this.establecerRangoDeFechas();
  }

  nextMonth() {
    this.mesActual++;
    if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }
    this.generarCalendario();
    this.establecerRangoDeFechas();
  }

  toggleFecha(fecha: string) {
    const index = this.listaFechas.indexOf(fecha);

    if (index >= 0) {
      this.listaFechas.splice(index, 1);
    } else {
      this.listaFechas.push(fecha);
    }

    // Verificar si todas las fechas están seleccionadas
    this.isAllSelected = this.diasDelMes
      .filter(d => d.esDelMes && d.fechaISO && this.esFechaValida(d.fechaISO))
      .every(d => this.listaFechas.includes(d.fechaISO));

    this.actualizarVistaPrevia();
  }

  eliminarFecha(i: number) {
    this.listaFechas.splice(i, 1);
    this.actualizarVistaPrevia();
  }

  // VISTA PREVIA (RESUMEN)
  actualizarVistaPrevia() {
    // Complex
    this.complejoSeleccionado = this.complejos.find(c =>
      c.idComplejo == this.idComplejo
    );

    console.log("Seleccionado:", this.complejoSeleccionado);

    // Canchas seleccionadas
    this.canchasSeleccionadas = this.canchas.filter(c => c.selected);

    // CÁLCULOS NUMÉRICOS
    this.cantidadBloquesPorDia = this.calcularBloquesPorDia();
    this.totalCombinaciones = this.canchasSeleccionadas.length * this.listaFechas.length;
    this.totalHorariosFinal = this.totalCombinaciones * this.cantidadBloquesPorDia;
  }

  calcularBloquesPorDia(): number {
    const [h1, m1] = this.rangoHoraInicio.split(":").map(Number);
    const [h2, m2] = this.rangoHoraFin.split(":").map(Number);

    const inicio = h1 * 60 + m1;
    const fin = h2 * 60 + m2;

    return Math.floor((fin - inicio) / this.duracionBloque);
  }

  toggleSeleccionarTodoMes() {
    if (this.isAllSelected) {
      // Deseleccionar todo
      this.listaFechas = [];
      this.isAllSelected = false;
    } else {
      // Seleccionar solo fechas válidas
      this.listaFechas = this.diasDelMes
        .filter(d => d.esDelMes && d.fechaISO && this.esFechaValida(d.fechaISO))
        .map(d => d.fechaISO);

      this.isAllSelected = true;
    }

    this.actualizarVistaPrevia();
  }

  esFechaValida(fechaISO: string): boolean {
    return fechaISO >= this.minDate && fechaISO <= this.maxDate;
  }

  public generarTallerMasivo() {
    if (!this.idComplejo || this.idComplejo === 0) {
      this.msg.show('Seleccione un complejo', 'warning');
      return;
    }
    if (this.canchasSeleccionadas.length === 0) {
      this.msg.show('Seleccione al menos una cancha', 'warning');
      return;
    }
    if (this.listaFechas.length === 0) {
      this.msg.show('Seleccione al menos una fecha', 'warning');
      return;
    }
    const listaCanchas = this.canchasSeleccionadas.map(c => c.idCancha).join(',');
    const listaFechas = this.listaFechas.join(',');
    const horaInicio = this.rangoHoraInicio;
    const horaFin = this.rangoHoraFin;
    this.isLoading = true;
    const payload: IReservaTallerMasivoRequest = {
      listaCanchas,
      listaFechas,
      horaInicio,
      horaFin
    };
    // Reemplazar con el servicio real para generar talleres masivos
    this.reservaServicio.marcarTallerMasivo(payload).subscribe({ 
      next: (res: IReservaGeneralResponse) => {
        console.log(res);
        this.isLoading = false;
        if (res.status !== 1) {
          this.isLoading = false;
          this.msg.show('Error generando talleres: ' + res.message, 'error');
          this.isAllSelected = false;
          return;
        } 
        this.resetForm();
        this.isAllSelected = false;
        this.listaFechas = [];
        this.actualizarVistaPrevia();
        this.msg.show(res.message, 'success');
      },
      error: () => {
        this.isLoading = false;
        this.msg.show('Error generando talleres', 'error');
      }
    });
  }


  private resetForm() {
    this.idComplejo = 0;
    this.canchas = [];
    this.listaFechas = [];
    this.canchasSeleccionadas = [];
    this.complejoSeleccionado = null;
    this.cantidadBloquesPorDia = 0;
    this.totalCombinaciones = 0;
    this.totalHorariosFinal = 0;
  }
}
