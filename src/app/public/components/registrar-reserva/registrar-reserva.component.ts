import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MessageComponent } from '../../../shared/message/message.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { CanchasService } from '../../../core/service/canchas.service';
import { dataCanchas, ICanchasRequest } from '../../../core/interfaz/canchas';
import { FormsModule } from '@angular/forms';
import { ComplejoAdminRequest, ComplejoAdminResponse } from '../../../core/interfaz/comAdmin';
import { ComplejoAdminSerivice } from '../../../core/service/comAdmin.service';
import { HorarioSlot, IDHorariosRequest, IHorariosResponse } from '../../../core/interfaz/horarios';
import { HorarioService } from '../../../core/service/horario.service';
import { TarifaService } from '../../../core/service/tarifa';
import { ITarifaRequest, ITarifaResponse, TarifaDetalleResponse } from '../../../core/interfaz/tarifa';
import { IReservaCancelarRequest, IReservaDetalleResponse, IReservaRegistrarRequest, IReservaRegistrarResponse, IReservarLiberarReservaExpirdaResponse } from '../../../core/interfaz/reserva';
import { ReservaService } from '../../../core/service/reserva.service';
import { NiubizService } from '../../../core/service/niubiz.service';
import { environment } from '../../../../environments/environment';
import { INumeroCompra, LogVisa } from '../../../core/interfaz/niuviz';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';


declare var VisanetCheckout: any;

@Component({
  selector: 'app-registrar-reserva',
  standalone: true,
  imports: [NgIf, MessageComponent, LoadingComponent, NgClass, NgFor, FormsModule, DecimalPipe],
  templateUrl: './registrar-reserva.component.html',
  styleUrl: './registrar-reserva.component.css'
})


export class RegistrarReservaComponent implements OnChanges, OnDestroy {
  @Input() abrirModal: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @ViewChild('msg') msg!: MessageComponent;
  @Input() idComplejo!: number;

  isLoading = false;
  activeStep: 'datos' | 'reserva' | 'finalizar' = 'datos';
  pasoActivo = 1;
  verMasResponsabilidad = false;

  setStep(step: 'datos' | 'reserva' | 'finalizar') {
    this.activeStep = step;
  }

  dataCanchas: dataCanchas[] = [];
  idAdministrado: number = 0;
  idReserva: number = 0;
  tipoPersona: string = '01';
  tipoDocumento: string = '01';
  numeroDocumento: string = '62126949';
  nombre: string = 'abel';
  paterno: string = 'velasquez';
  materno: string = 'villafranca';
  telefono: string = '922355307';
  correo: string = 'abel@gmail.com';
  conAcepto: Boolean = false;
  conNoResonsabiliza: Boolean = false;

  maxLength: number = 8;

  canchaSeleccionadaId: number = 0;
  fechaReserva: string = '';

  horarios: HorarioSlot[] = [];

  totalPagar: number = 0;

  footerDisabled: boolean = false;

  resumenReserva: IReservaDetalleResponse = {} as IReservaDetalleResponse;

  numeroCompra!: INumeroCompra;

  sessionToken: string = '';

  constructor(
    private canchasService: CanchasService,
    private comAdminService: ComplejoAdminSerivice,
    private horarioService: HorarioService,
    private tarifaService: TarifaService,
    private reservaService: ReservaService,
    private visa: NiubizService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idComplejo']) {
      console.log("ID recibido del padre:", this.idComplejo);
      this.listarCanchasCbo(this.idComplejo);
    }
  }

  public cerrarModal() {
    this.cerrar.emit();
    this.idComplejo = 0;
    this.activeStep = 'datos';
    this.pasoActivo = 1;

    this.limpiarCampoDatos();
    this.limpiarCampoReserva();
    clearInterval(this.interval);
    this.resumenReserva = {} as IReservaDetalleResponse;
  }

  private listarCanchasCbo(idComplejo: number) {
    this.isLoading = true;
    const payload: ICanchasRequest = {
      opcion: 1,
      idComplejo: idComplejo
    };
    this.canchasService.listarCanchas(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status !== 'success') {
          this.msg.show('Error al listar los complejos deportivos.', 'error');
          return;
        }
        this.dataCanchas = response.data;
      },
      error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al listar los complejos deportivos.', 'error');
      }
    });
  }

  public RegistrarComplejoAdmin() {
    this.isLoading = true;
    if (!this.validarCampos()) {
      this.isLoading = false;
      return;
    }
    const payload: ComplejoAdminRequest = {
      tipoPersona: this.tipoPersona,
      tipoDocumento: this.tipoDocumento,
      numeroDocumento: this.numeroDocumento,
      nombre: this.nombre,
      paterno: this.paterno,
      materno: this.materno,
      telefono: this.telefono,
      correo: this.correo,
      conAcepto: this.conAcepto ? 1 : 0,
      conNoResonsabilizar: this.conNoResonsabiliza ? 1 : 0
    }
    this.comAdminService.registrarComplejoAdministrador(payload).subscribe({
      next: (response: ComplejoAdminResponse) => {
        this.isLoading = false;
        console.log(response);
        if (response.status !== 'success') {
          this.msg.show(response.message, 'error');
          return;
        }
        /* this.msg.show('Administrador registrado exitosamente.','success'); */
        this.idAdministrado = response.data.idAdministrado;
        console.log('ID Administrador:', this.idAdministrado);
        this.pasoActivo = 2;
        this.activeStep = 'reserva';

      }, error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al registrar el administrador.', 'error');
      }
    });
  }

  private validarCampos(): boolean {

    if (this.tipoDocumento === '01') {
      if (this.numeroDocumento.length !== 8) {
        this.msg.show('El número de documento debe tener 8 caracteres para DNI.', 'warning');
        return false;
      }
    }

    if (this.tipoDocumento === '04') {
      if (this.numeroDocumento.length !== 9) {
        this.msg.show('El número de documento debe tener 9 caracteres para CE .', 'warning');
        return false;
      }
    }

    if (this.conAcepto === false || this.conNoResonsabiliza === false) {
      this.msg.show('Debe aceptar los términos y condiciones.', 'warning');
      return false;
    }

    if (!this.numeroDocumento || !this.nombre || !this.paterno || !this.telefono || !this.correo) {
      this.msg.show('Por favor, complete todos los campos obligatorios.', 'warning');
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.correo)) {
      this.msg.show("Formato de correo electrónico inválido", "warning");
      return false;
    }

    return true;
  }

  public onTipoDocumentoChange(): void {
    if (this.tipoDocumento === '01') {
      this.maxLength = 8;
    } else if (this.tipoDocumento === '04') {
      this.maxLength = 9;
    }
    if (this.numeroDocumento.length > this.maxLength) {
      this.numeroDocumento = this.numeroDocumento.slice(0, this.maxLength);
    }
    this.numeroDocumento = '';
  }

  public onNumeroDocumentoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/\D/g, '');
    input.value = sanitizedValue;
    this.numeroDocumento = sanitizedValue;

    if (input.value.length > this.maxLength) {
      input.value = input.value.slice(0, this.maxLength);
      this.numeroDocumento = input.value;
    }
  }

  public onNumeroTelefonoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/\D/g, '');
    input.value = sanitizedValue;
    this.telefono = sanitizedValue;

    if (input.value.length > 9) {
      input.value = input.value.slice(0, 9);
      this.telefono = input.value;
    }
  }

  public PasoActivoReserva() {
    if (this.idAdministrado === 0) {
      this.msg.show('Primero registre sus datos personales.', 'warning');
      return;
    }
    this.pasoActivo = 2;
  }

  public PasoActivoFinalizar() {
    if (!this.validarCampoReserva()) {
      return;
    }
    this.registrarReserva();
  }

  toggleVerMas(): void {
    this.verMasResponsabilidad = !this.verMasResponsabilidad;
  }

  public buscarNuevamenteHorario() {
    this.horasSeleccionadas = [];
    this.totalPagar = 0;
    this.dataTarifa = [];
    this.horarios = [];
  }

  public listarHorarios() {
    this.horasSeleccionadas = [];
    this.totalPagar = 0;
    this.dataTarifa = [];
    this.liberarReservaExpirada();

    if (this.canchaSeleccionadaId == 0) {
      this.msg.show('Seleccione una cancha.', 'warning');
      this.horarios = [];
      return;
    }
    if (this.fechaReserva === '') {
      this.msg.show('Seleccione una fecha de reserva.', 'warning');
      this.horarios = [];
      return;
    }

    const payload: IDHorariosRequest = {
      idCancha: this.canchaSeleccionadaId,
      fecha: this.fechaReserva
    };

    this.isLoading = true;
    this.horarioService.listarHorariosCancha(payload).subscribe({
      next: (response: IHorariosResponse) => {
        this.isLoading = false;
        console.log(response.data[0].status);
        if (response.status !== 'success') {
          this.msg.show('Error al listar los horarios.', 'error');
          this.horarios = [];
          return;
        }
        if (response.data[0].status === 0) {
          this.msg.show(response.data[0].message, 'warning');
          this.horarios = [];
          return;
        }
        this.horarios = response.data.map((item: any) => ({
          id: item.idHorarioBase,
          rango: item.rango,
          estado: item.estado === 'disponible' ? 'disponible' : (item.estado === 'reservado' ? 'reservado' : 'taller'),
          seleccionado: false
        }));
      },
      error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al listar los horarios.', 'error');
      }
    });
  }

  horasSeleccionadas: any[] = [];
  tarifaNoExiste: boolean = false;

  public seleccionarHorario(slot: any) {
    // Solo permitir si es disponible
    if (slot.estado !== 'disponible') {
      return;
    }

    // Si ya está seleccionado -> desmarcar
    if (slot.seleccionado) {
      slot.seleccionado = false;
      this.horasSeleccionadas = this.horasSeleccionadas.filter(h => h.id !== slot.id);
      //cuando deselecciono una hora, recalculo la tarifa, quitar de dataTarifa si la idHorarioBase coincide
      this.dataTarifa = this.dataTarifa.filter(d => d.idHorarioBase !== slot.id);
      this.totalPagar = this.dataTarifa.reduce((total, item) => total + item.precio, 0);
      return;
    }

    // Validar máximo 2 horas
    if (this.horasSeleccionadas.length >= 2) {
      this.msg.show("Solo puedes seleccionar máximo 2 horas por día.", "warning");
      return;
    }

    // Seleccionar
    slot.seleccionado = true;
    this.horasSeleccionadas.push(slot);
    this.calcularTarifa(slot);
  }

  dataTarifa: TarifaDetalleResponse[] = [];

  public calcularTarifa(slot: any) {
    if (this.canchaSeleccionadaId == 0) {
      this.msg.show('Seleccione una cancha.', 'warning');
      return;
    }
    if (this.fechaReserva === '') {
      this.msg.show('Seleccione una fecha de reserva.', 'warning');
      return;
    }
    if (this.horasSeleccionadas.length === 0) {
      this.msg.show('Seleccione al menos un horario.', 'warning');
      return;
    }
    const payload: ITarifaRequest = {
      idCancha: this.canchaSeleccionadaId,
      fecha: this.fechaReserva,
      horarios: slot.id.toString()
    };
    this.isLoading = true;
    this.tarifaService.calcularTarifa(payload).subscribe({
      next: (response: ITarifaResponse) => {
        this.isLoading = false;
        if (response.status == 0) {
          this.msg.show(response.message, 'warning');
          slot.seleccionado = false;
          this.horasSeleccionadas = this.horasSeleccionadas.filter(h => h.id !== slot.id);
          return;
        }
        console.log(response.detalles)
        this.agregarDatataTarifa(response.detalles);
      },
      error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al calcular la tarifa.', 'error');
      }
    });
  }

  private agregarDatataTarifa(nuevaData: TarifaDetalleResponse[]) {
    this.dataTarifa = [...this.dataTarifa, ...nuevaData];
    this.totalPagar = this.dataTarifa.reduce((total, item) => total + item.precio, 0);
  }

  public clickSiguentePaso() {
    if (this.pasoActivo == 1) {
      this.RegistrarComplejoAdmin();
    }
    if (this.pasoActivo == 2) {
      this.registrarReserva();
    }
  }

  private registrarReserva() {
    this.isLoading = true;
    if (!this.validarCampoReserva()) {
      this.isLoading = false;
      return;
    }
    const horariosSeleccionadosIds = this.dataTarifa.map(d => d.idHorarioBase);
    const payload: IReservaRegistrarRequest = {
      idAdministrado: this.idAdministrado,
      idCancha: this.canchaSeleccionadaId,
      fecha: this.fechaReserva,
      horarios: horariosSeleccionadosIds.join(','),
      montoTotal: this.totalPagar,
      cantidadHoras: this.horasSeleccionadas.length
    };

    this.reservaService.registrarReserva(payload).subscribe({
      next: (response: IReservaRegistrarResponse) => {
        this.isLoading = false;
        console.log(response);
        if (response.status !== 1) {
          this.listarHorarios();
          this.horasSeleccionadas = [];
          this.totalPagar = 0;
          this.dataTarifa = [];
          this.msg.show(response.message, 'error');
          return;
        }
        this.idReserva = response.idReserva;
        this.detalleReserva(response.idReserva);
        this.generateSessionToken();
        this.startTimer();
        this.pasoActivo = 3;
        this.footerDisabled = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al registrar la reserva.', 'error');
      }
    });
  }

  private validarCampoReserva(): boolean {
    if (this.idAdministrado == 0) {
      this.msg.show('No existe administrado, cerrar la ventana y volver a reservar.', 'warning');
      return false;
    }
    if (this.canchaSeleccionadaId == 0) {
      this.msg.show('No existe cancha seleccionado.', 'warning');
      return false;
    }
    if (this.fechaReserva == '') {
      this.msg.show('No existe fecha de reserva.', 'warning');
      return false;
    }
    if (this.horasSeleccionadas.length == 0) {
      this.msg.show('No existe horarios seleccionados.', 'warning');
      return false;
    }
    return true;
  }

  public volverAmodificarReserva() {
    this.isLoading = true;
    if (!this.resumenReserva || this.resumenReserva.idReserva === undefined || this.resumenReserva.idReserva === 0) {
      this.msg.show('No hay una reserva para cancelar.', 'warning');
      this.isLoading = false;
      return;
    }
    const payload: IReservaCancelarRequest = {
      opcion: 2,
      idReserva: this.resumenReserva ? this.resumenReserva.idReserva : 0
    };
    this.reservaService.cancelarReserva(payload).subscribe({
      next: (response: IReservaRegistrarResponse) => {
        this.isLoading = false;
        if (response.status !== 1) {
          this.msg.show(response.message, 'error');
          return;
        }
        /* this.msg.show('Reserva cancelada exitosamente.','success'); */
        //volver al paso 2 para modificar la reserva
        this.pasoActivo = 2;
        this.activeStep = 'reserva';
        this.resumenReserva = {} as IReservaDetalleResponse;
        this.horasSeleccionadas = [];
        this.totalPagar = 0;
        this.footerDisabled = false;
        this.horarios.some(h => h.seleccionado = false);
        this.dataTarifa = [];
      }
      ,
      error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al cancelar la reserva.', 'error');
      }
    });
  }

  private limpiarCampoDatos() {
    this.idAdministrado = 0;
    this.tipoPersona = '01';
    this.tipoDocumento = '01';
    this.numeroDocumento = '';
    this.nombre = '';
    this.paterno = '';
    this.materno = '';
    this.telefono = '';
    this.correo = '';
    this.conAcepto = false;
    this.conNoResonsabiliza = false;
  }

  private limpiarCampoReserva() {
    this.canchaSeleccionadaId = 0;
    this.fechaReserva = '';
    this.horarios = [];
    this.totalPagar = 0;
    this.footerDisabled = false;
    this.horasSeleccionadas = [];
    this.dataTarifa = [];
  }

  public cancelarReserva() {
    this.isLoading = true;
    if (!this.resumenReserva || this.resumenReserva.idReserva === undefined || this.resumenReserva.idReserva === 0) {
      this.msg.show('No hay una reserva para cancelar.', 'warning');
      this.isLoading = false;
      return;
    }
    const payload: IReservaCancelarRequest = {
      opcion: 1,
      idReserva: this.resumenReserva ? this.resumenReserva.idReserva : 0
    };
    this.reservaService.cancelarReserva(payload).subscribe({
      next: (response: IReservaRegistrarResponse) => {
        this.isLoading = false;
        if (response.status !== 1) {
          this.msg.show(response.message, 'error');
          return;
        }
        this.msg.show('Reserva cancelada exitosamente.', 'success');
        //cerrar el modal y reiniciar todo
        this.cerrarModal();
        this.pasoActivo = 1;
        this.idAdministrado = 0;
        this.limpiarCampoDatos();
        this.limpiarCampoReserva();
        clearInterval(this.interval);
        this.activeStep = 'reserva';
        this.resumenReserva = {} as IReservaDetalleResponse;
      }
      ,
      error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al cancelar la reserva.', 'error');
      }
    });
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
          return;
        }
        this.resumenReserva = response;
      },
      error: (error) => {
        this.isLoading = false;
        this.msg.show('Error al obtener el detalle de la reserva.', 'error');
      }
    });
  }

  timeLeft: number = 150; // 5 minutos = 300 segundos
  interval: any;

  startTimer() {
    clearInterval(this.interval);
    this.timeLeft = 150;

    this.interval = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.cancelarPorTimeout();
      }
    }, 1000);
  }

  cancelarPorTimeout() {
    this.msg.show('El tiempo para completar la reserva ha expirado. La reserva ha sido cancelada automáticamente.', 'warning');
    // solo cuando hay idReserva en el resumenReserva ejecutar este funcion
    if (this.resumenReserva && this.resumenReserva.idReserva) {
      this.isLoading = true;
      const payload: IReservaCancelarRequest = {
        opcion: 3,
        idReserva: this.resumenReserva ? this.resumenReserva.idReserva : 0
      };
      this.reservaService.cancelarReserva(payload).subscribe({
        next: (response: IReservaRegistrarResponse) => {
          this.isLoading = false;
          if (response.status !== 1) {
            this.msg.show(response.message, 'error');
            return;
          }
        }
        ,
        error: (error) => {
          this.isLoading = false;
          this.msg.show('Error al cancelar la reserva.', 'error');
        }
      });
    }
    this.cerrarModal();
    this.pasoActivo = 1;
    this.idAdministrado = 0;
    this.limpiarCampoDatos();
    this.limpiarCampoReserva();
    clearInterval(this.interval);
    this.activeStep = 'reserva';
    this.resumenReserva = {} as IReservaDetalleResponse;
  }

  public liberarReservaExpirada() {
    this.reservaService.liberarReservaExpirada().subscribe({
      next: (response: IReservarLiberarReservaExpirdaResponse) => {
        if (response.status !== 1) {
          console.log('Error al liberar reservas expiradas:', response.message);
          return;
        }
        /* console.log('correcto: ', response.message); */
      },
      error: (error) => {
        console.error('Error al liberar reservas expiradas:', error);
      }
    });
  }

  public obtenerNumeroCompra() {
    const obj: any = {
      opcion: "99"
    }
    this.visa.obtenerNumeroCompra(obj).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.status = "success") {
          this.numeroCompra = res.data
        } else {
          this.msg.show('Error al obtener el número de compra.', 'error');
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    window.onbeforeunload = null;
    window.onpopstate = null;
  }

  formatTime(seconds: number): string {
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    return `${mm}:${ss < 10 ? '0' + ss : ss}`;
  }


  /*  public pruebaNiubiz(){
     
     this.generateSessionToken();
   } */


  public generateSessionToken() {
    const payload = {
      amount: parseFloat(this.totalPagar.toString()),
      purchaseNumber: this.numeroCompra.purchaseNumber,
      email: this.correo,
      numeroDocumento: this.numeroDocumento,
    };
    this.visa.generarSessionToken(payload).subscribe({
      next: (response: any) => {
        this.sessionToken = response.sessionToken;
        console.log("SESSION TOKEN:", this.sessionToken);
      },
      error: (error) => {
        this.msg.show('Error al obtener el session token.', 'error');
      }
    });
  }

  public ejecutarCheckout() {
    if (!this.sessionToken) {
      this.msg.show('No se ha generado el session token intenta nuevamente.', 'error');
      return;
    }
    
    if (!this.numeroCompra || !this.numeroCompra.purchaseNumber) {
      this.msg.show('No se ha obtenido el número de compra.', 'error');
      return;
    }
    
    if(this.dataTarifa[0].codTasa == undefined || this.dataTarifa[0].codTasa == null || this.dataTarifa[0].codTasa == ''){
      this.msg.show('No se ha obtenido la tasa de la tarifa comunicar con el administrador.', 'error');
      return;
    }
    this.registrarLog(this.sessionToken);

    (window as any).VisanetCheckout.configure({
      sessiontoken: this.sessionToken,
      channel: 'web',
      merchantid: environment.merchantId,
      purchasenumber: this.numeroCompra.purchaseNumber,
      amount: parseFloat(this.totalPagar.toString()),
      expirationminutes: '20',
      timeouturl: 'about:blank',
      merchantlogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzTo_xqutQBaVtbsOG4mduVSz2QEG7GN7tBA&s',
      formbuttoncolor: '#0a5bd3',
      action: `${environment.apiUrl}/niubiz/response-form?purchasenumber=${this.numeroCompra.purchaseNumber}&codigo=${this.resumenReserva.codigo}&idReserva=${this.idReserva}&descripcion=${this.resumenReserva.cancha}&tasa=${this.dataTarifa[0].codTasa}`,
      complete: function (params: any) {
        console.log('Pago completado:', params);
        alert('Pago completado: ' + JSON.stringify(params));
      },
    });
    (window as any).VisanetCheckout.open();
  }


  private registrarLog(sessionToken: string) {
    const log: LogVisa = {
      tramo: '0001',
      purchase_number: this.numeroCompra.purchaseNumber,
      channel: 'web',
      navegador: navigator.userAgent,
      url: `${environment.apiUrl}/${this.totalPagar}/${this.numeroCompra.purchaseNumber}/${this.idComplejo}`,
      estacion: '',
      visa_url: environment.checkoutJs,
      visa_merchant_id: environment.merchantId,
      sesion_visa: sessionToken,
      data:{},
      resumen: {
        codigo:  this.resumenReserva.codigo,
        amount: Number(this.totalPagar),
        total_deuda: Number(this.totalPagar),
        total_descuento:  0,
        criterio: '',
        cantidad_recibos: 1, //this.deta_caja_log
      },
      detalle: [this.resumenReserva]
    };
    this.visa.registrarLog(log).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Error al registrar el log:', error);
      }
    });
  }

}
