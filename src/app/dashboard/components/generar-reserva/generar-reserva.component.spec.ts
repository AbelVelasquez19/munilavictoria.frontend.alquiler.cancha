import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarReservaComponent } from './generar-reserva.component';

describe('GenerarReservaComponent', () => {
  let component: GenerarReservaComponent;
  let fixture: ComponentFixture<GenerarReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
