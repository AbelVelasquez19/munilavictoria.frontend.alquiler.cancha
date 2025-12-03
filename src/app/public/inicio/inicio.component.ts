import { Component, ViewChild } from '@angular/core';
import { Complejo, IcomplejoRequest } from '../../core/interfaz/Complejo';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RegistrarReservaComponent } from '../components/registrar-reserva/registrar-reserva.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ComplejoService } from '../../core/service/complejo.service';
import { MessageComponent } from '../../shared/message/message.component';
import { ActivatedRoute } from '@angular/router';
import { AprobadoComponent } from '../components/aprobado/aprobado.component';
import { RechazadoComponent } from "../components/rechazado/rechazado.component";

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

  mostrarResultado = true;
  pagoAprobado = false;
  purchaseNumber = "1039165";
  fechaOperacion = "2025-12-02 15:48";

  nombreCompleto = "VELASQUEZ VILLAFRANCA PRIMITIVO ABEL";
  dni = "62126949";
  celular = "922355307";

  canchaNombre = "Complejo Inca Garcilaso – Cancha 1";
  canchaTipo = "Loza de fútbol";

  fechaReserva = "2025-12-02";
  horaInicio = "13:00";
  horaFin = "14:00";

  codigoReserva = "1644050";

  totalPagado = 15.00;

  constructor(private complejoService: ComplejoService, private route: ActivatedRoute) { }

  cerrarModal(){
    
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

  EstadoPagoNiuviz: string = "APROBADO";


  ngOnInit(): void {
    this.listarComplejos();
    this.route.queryParams.subscribe(params => {
      const tid = params['tid'];
      if (tid) {
        console.log('Estado de pago recibido de Niuviz:', tid);
      }
    });
  }

  private listarResultadoPago() {
    if (this.EstadoPagoNiuviz == "APROBADO") {
      console.log('El pago se ha realizado con exito.', 'success');
    } else {
      console.log('El pago no se ha podido realizar.', 'error');
    }
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
        console.log(response);
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
