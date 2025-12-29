import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarTarifaComponent } from './registrar-tarifa.component';

describe('RegistrarTarifaComponent', () => {
  let component: RegistrarTarifaComponent;
  let fixture: ComponentFixture<RegistrarTarifaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarTarifaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarTarifaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
