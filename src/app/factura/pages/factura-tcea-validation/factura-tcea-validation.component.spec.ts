import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaTceaValidationComponent } from './factura-tcea-validation.component';

describe('FacturaTceaValidationComponent', () => {
  let component: FacturaTceaValidationComponent;
  let fixture: ComponentFixture<FacturaTceaValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaTceaValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturaTceaValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
