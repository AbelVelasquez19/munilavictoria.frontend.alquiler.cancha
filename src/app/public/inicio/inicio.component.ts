import { Component, HostListener, ViewChild } from '@angular/core';
import { Complejo, IcomplejoRequest } from '../../core/interfaz/Complejo';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RegistrarReservaComponent } from '../components/registrar-reserva/registrar-reserva.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ComplejoService } from '../../core/service/complejo.service';
import { MessageComponent } from '../../shared/message/message.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AprobadoComponent } from '../components/aprobado/aprobado.component';
import { RechazadoComponent } from "../components/rechazado/rechazado.component";
import { PagoService } from '../../core/service/pago.service';
import { IPagoAprobadoResponse, IPagoRechazadoResponse } from '../../core/interfaz/pago';
import { ErrorProcesarPagoComponent } from '../components/error-procesar-pago/error-procesar-pago.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RegistrarReservaComponent,
    LoadingComponent,
    MessageComponent,
    AprobadoComponent,
    RechazadoComponent,
    RouterModule,
    ErrorProcesarPagoComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  @ViewChild('msg') msg!: MessageComponent;
  @ViewChild('modalReserva') modalReserva!: RegistrarReservaComponent;
  public abrirModalRegistrarReserva = false;
  isLoading = false;
  complejos: Complejo[] = [];
  idComplejoSeleccionado: number = 0;

  EstadoPagoNiuviz: string = "";
  tid: string = "";
  mostrarModalRechazado: string = '';
  dataPagoRechazado: IPagoRechazadoResponse | null = null;

  mostarModalAprobado: string = '';
  dataPagoAprobado: IPagoAprobadoResponse | null = null;

  menuOpen: boolean = false;

  authRawJson: any;

  constructor(private complejoService: ComplejoService, private route: ActivatedRoute, private pagoService: PagoService) { }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeMenuOutside(event: Event) {
    const target = event.target as HTMLElement;

    // si hace click en el botón o el menú → no cerrar
    if (target.closest('.relative')) return;

    this.menuOpen = false;
  }

  ngOnInit(): void {
    this.listarComplejos();
    this.route.queryParams.subscribe(params => {
      const tid = params['tid'];
      this.tid = params['tid'];
      if(tid=="process_payment"){
        this.mostrarModalErrorProcesarPago = 'ERROR';
        return;
      }
      if (tid) {
        this.listarResultadoPago(tid);
      } else {
        console.log('No se encontró el parámetro tid en la URL');
      }
    });
  }

  mostrarModalErrorProcesarPago: string = '';

  cerrarModalRechazado() {
    this.mostrarModalRechazado = '';
  }

  cerrarModalAprobado() {
    this.mostarModalAprobado = '';
  }

  cerrarModalErrorProcesarPago() {
    this.mostrarModalErrorProcesarPago = '';
  }

  public cerrarRegistrarReserva() {
    this.abrirModalRegistrarReserva = false;
  }

  public abrirRegistrarReserva(idComplejo: number) {
    this.abrirModalRegistrarReserva = true;
    this.idComplejoSeleccionado = idComplejo;
    setTimeout(() => {
      if (this.modalReserva) {
        this.modalReserva.startTimer();
        this.modalReserva.obtenerNumeroCompra();
      }
    }, 50);
  }

  private listarResultadoPago(idToken: string) {
    this.isLoading = true;
    const payload = {
      idToken: idToken
    };

    this.pagoService.pagoRechazado(payload).subscribe({
      next: (response: IPagoRechazadoResponse) => {
        this.isLoading = false;
        if (response.estadoPago === "REJECTED") {
          this.mostrarModalRechazado = response.estadoPago;
          this.dataPagoRechazado = response;
          return;
        }
        if (response.estadoPago === "APPROVED") {
          this.listarResultadoPagoAprobado(idToken);
          return;
        }
        this.EstadoPagoNiuviz = response.estadoPago;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al procesar el pago rechazado:', error);
      }
    });
  }

  private listarResultadoPagoAprobado(idToken: string) {
    this.isLoading = true;
    const payload = {
      idToken: idToken
    };
    this.pagoService.pagoAprobado(payload).subscribe({
      next: (response) => {
        console.log(response);
        this.isLoading = false;
        if (response.status == 1) {
          this.mostarModalAprobado = 'APROVED';
          this.dataPagoAprobado = response;
          this.authRawJson = JSON.parse(response.authRaw as string);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al procesar el pago aprobado:', error);
      }
    });
  }

  private listarComplejos() {
    this.isLoading = true;
    const payload: IcomplejoRequest = {
      opcion: 1
    };
    this.complejoService.listarComepljos(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status !== 'success') {
          this.msg.show('Error al listar los complejos deportivos.', 'error');
          return;
        }
        this.complejos = response.data.map(item => ({
          idComplejo: item.idComplejo,
          nombre: item.nombre,
          direccion: item.direccion,
          imagen: item.imagen
        }));
      },
      error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al listar los complejos deportivos.', 'error');
      }
    });
  }
}
