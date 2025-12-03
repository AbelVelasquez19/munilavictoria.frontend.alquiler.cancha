import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarReservaComponent } from './registrar-reserva.component';

describe('RegistrarReservaComponent', () => {
  let component: RegistrarReservaComponent;
  let fixture: ComponentFixture<RegistrarReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
