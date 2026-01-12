import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarTallerComponent } from './generar-taller.component';

describe('GenerarTallerComponent', () => {
  let component: GenerarTallerComponent;
  let fixture: ComponentFixture<GenerarTallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarTallerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarTallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
