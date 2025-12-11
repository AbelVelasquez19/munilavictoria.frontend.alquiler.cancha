import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorasdisponiblesComponent } from './horasdisponibles.component';

describe('HorasdisponiblesComponent', () => {
  let component: HorasdisponiblesComponent;
  let fixture: ComponentFixture<HorasdisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorasdisponiblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorasdisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
