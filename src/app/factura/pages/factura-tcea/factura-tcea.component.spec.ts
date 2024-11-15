import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaTceaComponent } from './factura-tcea.component';

describe('FacturaTceaComponent', () => {
  let component: FacturaTceaComponent;
  let fixture: ComponentFixture<FacturaTceaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaTceaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturaTceaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
