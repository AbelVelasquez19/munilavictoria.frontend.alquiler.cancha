import { DatePipe, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-horasdisponibles',
  imports: [FormsModule,NgClass,DatePipe,NgFor],
  templateUrl: './horasdisponibles.component.html',
  styleUrl: './horasdisponibles.component.css'
})
export class HorasdisponiblesComponent {
  // ==== FILTROS ====
  idComplejo: number | null = null;
  idCancha: number | null = null;
  fecha: string | null = null;

  complejos: any[] = [];
  canchas: any[] = [];

  // ==== TABLA ====
  listaHorarios: any[] = [];

  // ==== PAGINACIÓN ====
  paginaActual = 1;
  cantidadPorPagina = 10;
  totalRegistros = 0;

  get paginaInicio() {
    return (this.paginaActual - 1) * this.cantidadPorPagina + 1;
  }
  get paginaFin() {
    return Math.min(this.paginaActual * this.cantidadPorPagina, this.totalRegistros);
  }

  get pages() {
    const totalPaginas = Math.ceil(this.totalRegistros / this.cantidadPorPagina);
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  constructor(
   /*  private horasService: HorasService,
    private msg: MsgService */
  ) {}

  ngOnInit(): void {
    this.cargarComplejos();
  }

  // ============================================================
  // CARGAR COMPLEJOS
  // ============================================================
  cargarComplejos() {
  /*   this.horasService.getComplejos().subscribe({
      next: (res: any) => {
        this.complejos = res.data;
      },
      error: err => console.error(err)
    }); */
  }

  // ============================================================
  // AL SELECCIONAR COMPLEJO → CARGAR CANCHAS
  // ============================================================
  onChangeComplejo() {
    this.idCancha = null;
    this.canchas = [];

    if (!this.idComplejo) return;

    /* this.horasService.getCanchasByComplejo(this.idComplejo).subscribe({
      next: (res: any) => {
        this.canchas = res.data;
      },
      error: err => console.error(err)
    }); */
  }

  // ============================================================
  // BUSCAR HORARIOS
  // ============================================================
  buscar() {
    if (!this.idComplejo) {
      /* this.msg.show('Debe seleccionar un complejo.', 'error'); */
      return;
    }

    if (!this.fecha) {
      /* this.msg.show('Debe seleccionar una fecha.', 'error'); */
      return;
    }

    this.paginaActual = 1; // reset paginación

    const params = {
      idComplejo: this.idComplejo,
      idCancha: this.idCancha ?? 0,
      fecha: this.fecha,
      pagina: this.paginaActual,
      cantidad: this.cantidadPorPagina
    };

   /*  this.horasService.getHorasDisponibles(params).subscribe({
      next: (res: any) => {
        this.listaHorarios = res.data;
        this.totalRegistros = res.total;
      },
      error: err => {
        console.error(err);
        this.msg.show('Error al cargar horarios.', 'error');
      }
    }); */
  }

  // ============================================================
  // PAGINACIÓN
  // ============================================================
  goToPage(num: number) {
    this.paginaActual = num;
    this.buscar();
  }

  nextPage() {
    if (this.paginaActual < this.pages.length) {
      this.paginaActual++;
      this.buscar();
    }
  }

  prevPage() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.buscar();
    }
  }

  // ============================================================
  // ACCIÓN: BLOQUEAR HORARIO
  // ============================================================
  bloquear(h: any) {
   /*  this.msg.confirm('¿Desea bloquear este horario?', () => {
      this.horasService.bloquearHorario(h.idEstadoCancha).subscribe({
        next: (res: any) => {
          this.msg.show(res.message, 'success');
          this.buscar();
        },
        error: err => this.msg.show('Error al bloquear horario.', 'error')
      });
    }); */
  }

  // ============================================================
  // ACCIÓN: DESBLOQUEAR HORARIO
  // ============================================================
  desbloquear(h: any) {
    /* this.msg.confirm('¿Desea desbloquear este horario?', () => {
      this.horasService.desbloquearHorario(h.idEstadoCancha).subscribe({
        next: (res: any) => {
          this.msg.show(res.message, 'success');
          this.buscar();
        },
        error: err => this.msg.show('Error al desbloquear horario.', 'error')
      });
    }); */
  }

  // ============================================================
  // ACCIÓN: EDITAR ESTADO / MODAL (opcional)
  // ============================================================
  editar(h: any) {
    console.log('Editar horario:', h);
    // abrir modal si deseas
  }
}
