import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IReservaDetalleResponse, IReservarLiberarReservaExpirdaResponse } from '../../core/interfaz/reserva';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from '../../shared/message/message.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ReservaService } from '../../core/service/reserva.service';
import { NiubizService } from '../../core/service/niubiz.service';
import { INumeroCompra, LogVisa } from '../../core/interfaz/niuviz';
import { switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pago-pendiente',
  standalone: true,
  imports: [NgIf, RouterModule, DecimalPipe, NgFor, FormsModule, LoadingComponent, MessageComponent],
  templateUrl: './pago-pendiente.component.html',
  styleUrl: './pago-pendiente.component.css'
})
export class PagoPendienteComponent {
  menuOpen: boolean = false;
  @ViewChild('msg') msg!: MessageComponent;

  resumenReserva: IReservaDetalleResponse = {} as IReservaDetalleResponse;
  conAceptoTerminosPago: boolean = false;
  isLoading: boolean = false;

  detalleValido: boolean = false;
  sessionToken: string = '';
  numeroCompra!: INumeroCompra;

  idReserva: number = 0;

  constructor(
    private route: ActivatedRoute,
    private reservaService: ReservaService,
    private visa: NiubizService,
  ) { }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    const tokenIdCancha = this.route.snapshot.paramMap.get('tokenIdCancha');
    this.liberarReservaExpirada();
    if (tokenIdCancha) {
      const idCancha = atob(decodeURIComponent(tokenIdCancha));
      console.log('ID Cancha:', idCancha);
    }
    if (token) {
      const idReserva = atob(decodeURIComponent(token));
      console.log('ID Reserva:', idReserva);
      this.idReserva = Number(idReserva);
      this.detalleReserva(Number(idReserva));
    }
  }

  public detalleReserva(idReserva: number) {
    this.isLoading = true;
    const payload = {
      idReserva: idReserva
    };
    this.reservaService.deatalleReserva(payload).subscribe({
      next: (response: IReservaDetalleResponse) => {
        this.isLoading = false;
        if (response.status !== 1) {
          this.msg.show(response.message, 'error');
          this.detalleValido = false;
          return;
        }
        this.resumenReserva = response;
        this.detalleValido = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.detalleValido = false;
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

  public generateSessionToken(purchaseNumber: string) {
    this.isLoading = true;
    const payload = {
      amount: parseFloat(this.resumenReserva.montoTotal.toString()),
      purchaseNumber: purchaseNumber,
      email: this.resumenReserva.correo,
      numeroDocumento: this.resumenReserva.numeroDocumento,
    };
    this.visa.generarSessionToken(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.sessionToken = response.sessionToken;
      },
      error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al obtener el session token.', 'error');
      }
    });
  }

  public obtenerNumeroCompra() {
    const obj: any = {
      opcion: "99"
    }
    this.visa.obtenerNumeroCompra(obj).subscribe({
      next: (res: any) => {
        if (res.status = "success") {
          this.numeroCompra = res.data
          this.generateSessionToken(this.numeroCompra.purchaseNumber);
        } else {
          this.msg.show('Error al obtener el número de compra.', 'error');
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  public ejecutarCheckout() {
    if (!this.conAceptoTerminosPago) {
      this.msg.show(
        'Debe aceptar los términos y condiciones para continuar con el pago.',
        'warning'
      );
      return;
    }

    if (!this.detalleValido) {
      this.msg.show(
        'El detalle de la reserva no es válido.',
        'error'
      );
      return;
    }

    this.isLoading = true;

    this.obtenerNumeroCompraYSessionToken();
  }

  private obtenerNumeroCompraYSessionToken(): void {
    const payloadNumeroCompra = {
      opcion: '99'
    };
    this.visa.obtenerNumeroCompra(payloadNumeroCompra)
      .pipe(
        switchMap((res: any) => {

          if (res.status !== 'success' || !res.data?.purchaseNumber) {
            throw new Error('No se pudo obtener el número de compra.');
          }

          this.numeroCompra = res.data;

          const payloadSession = {
            amount: Number(this.resumenReserva.montoTotal),
            purchaseNumber: this.numeroCompra.purchaseNumber,
            email: this.resumenReserva.correo,
            numeroDocumento: this.resumenReserva.numeroDocumento
          };

          return this.visa.generarSessionToken(payloadSession);
        })
      )
      .subscribe({
        next: (response: any) => {
          if (!response?.sessionToken) {
            this.msg.show('No se pudo generar el session token.', 'error');
            return;
          }
          this.sessionToken = response.sessionToken;
          this.isLoading = false;
          this.iniciarCheckoutNiubiz();
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          this.msg.show(
            'No se pudo iniciar el proceso de pago. Intente nuevamente.',
            'error'
          );
        }
      })
  }

  private registrarLog(sessionToken: string) {
    const log: LogVisa = {
      tramo: '0001',
      purchase_number: this.numeroCompra.purchaseNumber,
      channel: 'web',
      navegador: navigator.userAgent,
      url: `${environment.apiUrl}/${this.resumenReserva.montoTotal}/${this.numeroCompra.purchaseNumber}`, ///${this.idComplejo}
      estacion: '',
      visa_url: environment.checkoutJs,
      visa_merchant_id: environment.merchantId,
      sesion_visa: sessionToken,
      data: {},
      resumen: {
        codigo: this.resumenReserva.codigo,
        amount: Number(this.resumenReserva.montoTotal),
        total_deuda: Number(this.resumenReserva.montoTotal),
        total_descuento: 0,
        criterio: '',
        cantidad_recibos: 1, //this.deta_caja_log
      },
      detalle: [this.resumenReserva]
    };
    this.visa.registrarLog(log).subscribe({
      next: (response: any) => {
        console.log('Log registrado exitosamente',response);
      },
      error: (error) => {
        console.error('Error al registrar el log:', error);
      }
    });
  }

  private iniciarCheckoutNiubiz(): void {
    if (!this.sessionToken || !this.numeroCompra?.purchaseNumber) {
      this.msg.show(
        'Datos incompletos para iniciar el pago.',
        'error'
      );
      return;
    }
    this.registrarLog(this.sessionToken);

    (window as any).VisanetCheckout.configure({
      sessiontoken: this.sessionToken,
      channel: 'web',
      merchantid: environment.merchantId,
      purchasenumber: this.numeroCompra.purchaseNumber,
      amount: parseFloat(this.resumenReserva.montoTotal.toString()),
      expirationminutes: '5',
      timeouturl: environment.url_action+'/inicio',
      merchantlogo: 'https://web.munilavictoria.gob.pe/mlv/assets/imgs/logo.png',
      formbuttoncolor: '#0a5bd3',
      action: `${environment.apiUrl}/niubiz/response-form?purchasenumber=${this.numeroCompra.purchaseNumber}&codigo=${this.resumenReserva.codigo}&idReserva=${this.idReserva}&descripcion=${this.resumenReserva.cancha}&correo=${this.resumenReserva.correo}`,
      complete: function (params: any) {
        alert('Pago completado: ' + JSON.stringify(params));
      }
    });
    (window as any).VisanetCheckout.open();

    console.log('Checkout listo:', {
      sessionToken: this.sessionToken,
      purchaseNumber: this.numeroCompra.purchaseNumber
    });
  }

}
