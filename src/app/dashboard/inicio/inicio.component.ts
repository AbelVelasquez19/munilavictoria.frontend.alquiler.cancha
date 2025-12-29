import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { DashboardService } from '../../core/service/Dashboard';
import { forkJoin, Subscription, timer } from 'rxjs';

import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexMarkers,
  ApexTooltip
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [DecimalPipe, NgApexchartsModule, NgIf, NgFor, NgClass],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit, OnDestroy {

  /* --- KPI -- */
  ingresosDia = 0;
  ingresosMes = 0;
  reservasDia = 0;
  pagosRechazados = 0;

  /* --- DATA -- */
  horasMasAlquiladas: { rango: string; totalReservas: number }[] = [];
  ingresoPorCancha: { cancha: string; totalCancha: number }[] = [];
  totalSumandoCancha = 0;

  diasConMayorDemanda: string[] = [];
  horasPicoDemanda: string[] = [];
  futbolMasSolicitada: string[] = [];

  /* --- CHART -- */
  chartOptions: ChartOptions = {
    series: [{ name: 'Ingresos', data: [] }],
    chart: { type: 'line', height: 280, toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 3 },
    markers: {
      size: 5,
      colors: ['#22c55e'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 7 }
    },
    dataLabels: {
      enabled: true,
      formatter: val => `S/ ${val}`,
      offsetY: -8,
      style: { fontSize: '9px', fontWeight: '600' },
      background: { enabled: true, borderRadius: 6 }
    },
    xaxis: { categories: [] },
    grid: { strokeDashArray: 4, borderColor: '#e5e7eb' },
    tooltip: { y: { formatter: val => `S/ ${val}` } }
  };

  private refreshSub!: Subscription;

  constructor(private dashboardService: DashboardService) {}

  /* --- INIT -- */
  ngOnInit(): void {
    this.refreshSub = timer(0, 300000).subscribe(() => {
      this.loadDashboard();
    });
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  /* --- CORE -- */
  private loadDashboard(): void {
    const fi = '2025-01-01';
    const ff = '2025-12-31';

    forkJoin({
      ingresosDia: this.dashboardService.dashboardIngreso(1, fi, ff),
      ingresosMes: this.dashboardService.dashboardIngreso(2, fi, ff),
      reservasDia: this.dashboardService.dashboardIngreso(3, fi, ff),
      pagosRechazados: this.dashboardService.dashboardIngreso(4, fi, ff),
      ingresosMensuales: this.dashboardService.dashboardIngreso(5, fi, ff),
      horasAlquiladas: this.dashboardService.dashboardIngreso(6, fi, ff),
      ingresoCancha: this.dashboardService.dashboardIngreso(7, fi, ff),
      diasDemanda: this.dashboardService.dashboardIngreso(9, fi, ff),
      horasPico: this.dashboardService.dashboardIngreso(10, fi, ff),
      canchaPico: this.dashboardService.dashboardIngreso(11, fi, ff)
    }).subscribe({
      next: r => {
        console.log(r.ingresoCancha.data);
        this.ingresosDia = r.ingresosDia.data?.[0]?.ingresosDia ?? 0;
        this.ingresosMes = r.ingresosMes.data?.[0]?.ingresosMes ?? 0;
        this.reservasDia = r.reservasDia.data?.[0]?.reservasDia ?? 0;
        this.pagosRechazados = r.pagosRechazados.data?.[0]?.pagosRechazados ?? 0;

        /* Chart */
        this.chartOptions = {
          ...this.chartOptions,
          series: [{ name: 'Ingresos', data: r.ingresosMensuales.data.map(x => x.total) }],
          xaxis: { categories: r.ingresosMensuales.data.map(x => x.nombreMes) }
        };

        /* Listas */
        this.horasMasAlquiladas = r.horasAlquiladas.data;
        this.ingresoPorCancha = r.ingresoCancha.data;
        this.totalSumandoCancha = this.ingresoPorCancha.reduce((a, b) => a + b.totalCancha, 0);

        /* Picos */
        this.diasConMayorDemanda = r.diasDemanda.data.map(x => x.dia);
        this.horasPicoDemanda = r.horasPico.data.map(x => x.horarioPico);
        this.futbolMasSolicitada = r.canchaPico.data.map(x => x.nombreCanchaPico);
      },
      error: err => console.error('Dashboard error', err)
    });
  }
}
