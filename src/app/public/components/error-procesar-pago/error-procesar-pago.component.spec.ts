import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorProcesarPagoComponent } from './error-procesar-pago.component';

describe('ErrorProcesarPagoComponent', () => {
  let component: ErrorProcesarPagoComponent;
  let fixture: ComponentFixture<ErrorProcesarPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorProcesarPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorProcesarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
