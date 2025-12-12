import { Component, EventEmitter, Input, Output, ViewChild, SimpleChanges } from '@angular/core';
import { MessageComponent } from '../../../shared/message/message.component';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { IcomplejoRequest, IComplejoResponse } from '../../../core/interfaz/Complejo';
import { ComplejoService } from '../../../core/service/complejo.service';
import { ICanchasRequest } from '../../../core/interfaz/canchas';
import { CanchasService } from '../../../core/service/canchas.service';
import { ComplejoAdminReservaSerivice } from '../../../core/service/comAdminReservas';
import { IHorarioMasivoRequest, IHorarioMasivoResponse } from '../../../core/interfaz/comAdminReservas';

@Component({
  selector: 'app-generar-horarios',
  imports: [NgIf, MessageComponent, LoadingComponent, FormsModule, DatePipe, NgFor, NgClass],
  templateUrl: './generar-horarios.component.html',
  styleUrl: './generar-horarios.component.css'
})
export class GenerarHorariosComponent {
  @Input() abrirModal: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @ViewChild('msg') msg!: MessageComponent;

  isLoading: boolean = false;

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
    private comAdminReservaService:ComplejoAdminReservaSerivice
  ) { }

  cerrarModal() {
    this.cerrar.emit();
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
    const max = new Date();

    // 8 días hacia adelante
    max.setDate(hoy.getDate() + 9);

    // Convertir a formato YYYY-MM-DD
    this.minDate = hoy.toISOString().split('T')[0];
    this.maxDate = max.toISOString().split('T')[0];

    console.log("MIN:", this.minDate, "MAX:", this.maxDate);
  }

  prevMonth() {
    this.mesActual--;
    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    }
    this.generarCalendario();
  }

  nextMonth() {
    this.mesActual++;
    if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }
    this.generarCalendario();
  }

  toggleFecha(fecha: string) {
    const index = this.listaFechas.indexOf(fecha);

    if (index >= 0) {
      this.listaFechas.splice(index, 1);
    } else {
      this.listaFechas.push(fecha);
    }

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

  public generarHorarios() {
    if(!this.idComplejo || this.idComplejo === 0){
      this.msg.show('Seleccione un complejo', 'warning');
      return;
    }
    if(this.canchasSeleccionadas.length === 0){
      this.msg.show('Seleccione al menos una cancha', 'warning');
      return;
    }
    if(this.listaFechas.length === 0){
      this.msg.show('Seleccione al menos una fecha', 'warning');
      return;
    }
    const listaCanchas = this.canchasSeleccionadas.map(c => c.idCancha).join(',');
    const listaFechas = this.listaFechas.join(',');
    console.log(this.idComplejo)
    console.log(listaCanchas)
    console.log(listaFechas)
    this.isLoading = true;
    const payload: IHorarioMasivoRequest = {
      idComplejo: this.idComplejo,
      listaCanchas,
      listaFechas,
      operador: 'COMPLEJO ADMIN'
    };
    this.comAdminReservaService.generarHorariosMasivos(payload).subscribe({
      next: (res:IHorarioMasivoResponse) => {
        this.isLoading = false;
        if(res.status !== 'success'){
          this.isLoading = false;
          this.msg.show('Error generando horarios: '+res.message, 'error');
          return;
        }
        this.resetForm();
      /*   this.cerrarModal(); */
        this.msg.show(res.data.message, 'success');
      },
      error: () => {
        this.isLoading = false;
        this.msg.show('Error generando horarios', 'error');
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
