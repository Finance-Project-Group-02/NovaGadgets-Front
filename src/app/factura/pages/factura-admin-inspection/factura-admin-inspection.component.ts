import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FacturaResponseDTO } from '../../models/facturaResponseDTO';
import { FacturaRequestDTO } from '../../models/facturaRequestDTO';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaSummary } from '../../models/facturaSummary';
import { FacturaService } from '../../services/factura/factura.service';

@Component({
  selector: 'app-factura-admin-inspection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  templateUrl: './factura-admin-inspection.component.html',
  styleUrls: ['./factura-admin-inspection.component.css']
})
export class FacturaAdminInspectionComponent implements OnInit {
  formDescuento!: FormGroup;
  facturaResponse!: FacturaResponseDTO;
  facturaSummary!: FacturaSummary;
  evaular = false;
  tasaValue!: String
  facturaId: number = 0;

  //Fechas
  fechaEmision!: String
  fechaDescuento!: String
  fechaVencimiento!: String

  selectedOption!: string;
  selectedOptionNominal!: string;

  options = [
    { value: 1, label: 'Diaria' },
    { value: 15, label: 'Quincenal' },
    { value: 30, label: 'Mensual' },
    { value: 60, label: 'Bimestral' },
    { value: 90, label: 'Trimestral' },
    { value: 120, label: 'Cuatrimestral' },
    { value: 180, label: 'Semestral' },
    { value: 365, label: 'Anual' },
    { value: 'especial', label: 'Especial' },
  ];

  gastosIniciales = [
    { name: 'Portes' },
    { name: 'Fotocopias' },
    { name: 'Comisión de estudio' },
    { name: 'Comisión de desembolso' },
    { name: 'Comisión de intermediación' },
    { name: 'Gastos de administración' },
    { name: 'Gastos notariales' },
    { name: 'Gastos registrales' },
    { name: 'Seguro' },
    { name: 'Otros gastos' }
  ];

  gastosFinales = [
    { name: 'Portes' },
    { name: 'Gastos Administrativos' },
    { name: 'Otros gastos'}
  ]

  addedGastosIniciales: any[] = [];
  addedGastosFinales: any[] =[];

  initialCosts: number[] = [];
  finalCosts: number[] = [];

  constructor(private formBuilder: FormBuilder, private facturaService: FacturaService, private router: Router,
    private activatedRoute: ActivatedRoute, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.cargarFormulario();
  }

  cargarFormulario(){
    this.facturaId = this.activatedRoute.snapshot.params["id"];

    this.formDescuento = this.formBuilder.group({
      type:[[Validators.required]],
      startDate:[[Validators.required]],
      paymentDate:["", [Validators.required]],
      totalInvoiced:["", [Validators.required]],
      retention:[""],

      dayByYear:["", [Validators.required]],
      rateTerm:["", [Validators.required]],
      effectiveRate:["", [Validators.required]],
      discountDate:["", [Validators.required]],
      especialRate:["", [Validators.required]],
      capitalization:[""],
      especialRateCapitalization:[""],

      gastoInicial:[""],
      valorTipoInicial:[""],
      valorInicial:[""],

      gastoFinal:[""],
      valorTipoFinal:[""],
      valorFinal:[""],
    });

    this.facturaService.getFacturaById(this.facturaId).subscribe({
      next: (data: FacturaSummary) => {
        this.facturaSummary = data;

        let fechaDate: Date = new Date(data.orderDate + 'T00:00:00');
        this.formDescuento.get("startDate")?.setValue(fechaDate),
        this.formDescuento.get("totalInvoiced")?.setValue(data.totalInvoiced),
        this.formDescuento.get('startDate')?.disable(),
        this.formDescuento.get('totalInvoiced')?.disable()
      },
      error: (err)=>{
        console.log(err);
      }
    })


    //Gastos Iniciales
    this.formDescuento.get("gastoInicial")?.valueChanges.subscribe(gasto => {
      if (gasto) {
        this.formDescuento.get('valorTipoInicial')?.enable();
        this.formDescuento.get('valorInicial')?.enable();
      } else {
        this.formDescuento.get('valorTipoInicial')?.disable();
        this.formDescuento.get('valorInicial')?.disable();
      }
    });
    this.formDescuento.get('valorTipoInicial')?.disable();
    this.formDescuento.get('valorInicial')?.disable();

    //Gastos Finales
    this.formDescuento.get("gastoFinal")?.valueChanges.subscribe(gasto => {
      if (gasto) {
        this.formDescuento.get('valorTipoFinal')?.enable();
        this.formDescuento.get('valorFinal')?.enable();
      } else {
        this.formDescuento.get('valorTipoFinal')?.disable();
        this.formDescuento.get('valorFinal')?.disable();
      }
    });
    this.formDescuento.get('valorTipoFinal')?.disable();
    this.formDescuento.get('valorFinal')?.disable();
  }

  actualizarTipo(event: any){
    this.tasaValue = event.value;
  }

  convertirDateToString(fechaDate: Date): String {
    const year = fechaDate.getFullYear();
    const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  convertirFechaDescuentoToString(event: any){
    let fechaDate:Date=event.value;
    const year = fechaDate.getFullYear();
    const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaDate.getDate().toString().padStart(2, '0');
    this.fechaDescuento = `${year}-${month}-${day}`;
  }

  convertirFechaVencimientoToString(event: any){
    let fechaDate:Date=event.value;
    const year = fechaDate.getFullYear();
    const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaDate.getDate().toString().padStart(2, '0');
    this.fechaVencimiento = `${year}-${month}-${day}`;
  }

  selectionChange(event: any){
    this.selectedOption = event.value;
  }

  selectionChangeNominal(event: any){
    this.selectedOptionNominal = event.value;
  }

  agregarGastoInicial() {
    const gastoSeleccionado = this.formDescuento.get("gastoInicial")?.value;
    const valorTipo = this.formDescuento.get("valorTipoInicial")?.value;
    const valor = this.formDescuento.get("valorInicial")?.value;

    this.addedGastosIniciales.push({ gasto: gastoSeleccionado, valorTipo, valor });

    this.formDescuento.get("gastoInicial")?.reset();
    this.formDescuento.get("valorTipoInicial")?.reset();
    this.formDescuento.get("valorInicial")?.reset();
  }

  agregarGastoFinal() {
    const gastoSeleccionado = this.formDescuento.get("gastoFinal")?.value;
    const valorTipo = this.formDescuento.get("valorTipoFinal")?.value;
    const valor = this.formDescuento.get("valorFinal")?.value;
    
    this.addedGastosFinales.push({ gasto: gastoSeleccionado, valorTipo, valor });

    this.formDescuento.get("gastoFinal")?.reset();
    this.formDescuento.get("valorTipoFinal")?.reset();
    this.formDescuento.get("valorFinal")?.reset();
  }
 
  Regresar(){
    this.evaular=false;
    console.log(this.facturaId);
  }

  evaluarFactura(){
    console.log(this.fechaEmision);
    this.evaular=true;

    let selectedValue;
    let selectedOptionNominal;

    let fechaEmision = this.formDescuento.get("startDate")?.value;

    this.fechaEmision = this.convertirDateToString(fechaEmision);

    const rateTermValue = this.formDescuento.get("rateTerm")?.value;
    if (rateTermValue === 'especial') {
      selectedValue = this.formDescuento.get("especialRate")?.value;
    } else {
      selectedValue = this.options.find(option => option.value === rateTermValue)?.value;
    }

    const rateTermNominal = this.formDescuento.get("capitalization")?.value;
    if (rateTermNominal === 'especial') {
      selectedOptionNominal = this.formDescuento.get("especialRateCapitalization")?.value;
    } else {
      selectedOptionNominal = this.options.find(option => option.value === rateTermNominal)?.value;
    }

    let gastosInicialesTemporal = this.addedGastosIniciales.map(item => ({ ...item }));
    let gastosFinalesTemporal = this.addedGastosFinales.map(item => ({ ...item }));
    
    gastosInicialesTemporal.forEach(item => {
      if (item.valorTipo === 'P') {
        item.valor = item.valor / 100 * this.facturaSummary.totalInvoiced;
      }
    });
    
    gastosFinalesTemporal.forEach(item => {
      if (item.valorTipo === 'P') {
        item.valor = item.valor / 100 * this.facturaSummary.totalInvoiced;
      }
    });
    
    const gastosIniciales = gastosInicialesTemporal.map(item => item.valor);
    const gastosFinales = gastosFinalesTemporal.map(item => item.valor);

    let factura: FacturaRequestDTO | null = null;

    if (this.tasaValue == "E") {
      factura = {
        state: "PENDIENTE",
        startDate: this.fechaEmision,
        paymentDate: this.fechaVencimiento,
        discountDate: this.fechaDescuento,
        retention: this.formDescuento.get("retention")?.value,
        type: this.tasaValue,
        effectiveRate: this.formDescuento.get("effectiveRate")?.value,
        capitalization: 0,
        rateTerm: selectedValue,
        dayByYear: this.formDescuento.get("dayByYear")?.value,
        initialCosts: gastosIniciales,
        finalCosts: gastosFinales
      };
    } else if (this.tasaValue == "N") {
      factura = {
        state: "PENDIENTE",
        startDate: this.fechaEmision,
        paymentDate: this.fechaVencimiento,
        discountDate: this.fechaDescuento,
        retention: this.formDescuento.get("retention")?.value,
        type: this.tasaValue,
        effectiveRate: this.formDescuento.get("effectiveRate")?.value,
        capitalization: selectedOptionNominal,
        rateTerm: selectedValue,
        dayByYear: this.formDescuento.get("dayByYear")?.value,
        initialCosts: gastosIniciales,
        finalCosts: gastosFinales
      };
    }

    if(factura){
      this.facturaService.getSimularFactura(factura,this.facturaId).subscribe({
        next: (data: FacturaResponseDTO)=>{
          this.facturaResponse = data;
          console.log(this.facturaResponse);
          this.snackbar.open("Simulacion completa","OK",{duration:2000})
        },
        error: (err)=>{
          console.log(err);
          console.log(factura);
          this.snackbar.open("Simulacion fallida","OK",{duration:2000})
        }
      })
    }

  }

  EmitirFactura(){
    let selectedValue;
    let selectedOptionNominal;

    let fechaEmision = this.formDescuento.get("startDate")?.value;

    this.fechaEmision = this.convertirDateToString(fechaEmision);

    const rateTermValue = this.formDescuento.get("rateTerm")?.value;
    if (rateTermValue === 'especial') {
      selectedValue = this.formDescuento.get("especialRate")?.value;
    } else {
      selectedValue = this.options.find(option => option.value === rateTermValue)?.value;
    }

    const rateTermNominal = this.formDescuento.get("capitalizationa")?.value;
    if (rateTermNominal === 'especial') {
      selectedOptionNominal = this.formDescuento.get("especialRateCapitalization")?.value;
    } else {
      selectedOptionNominal = this.options.find(option => option.value === rateTermNominal)?.value;
    }

    let gastosInicialesTemporal = this.addedGastosIniciales.map(item => ({ ...item }));
    let gastosFinalesTemporal = this.addedGastosFinales.map(item => ({ ...item }));
    
    gastosInicialesTemporal.forEach(item => {
      if (item.valorTipo === 'P') {
        item.valor = item.valor / 100 * this.facturaSummary.totalInvoiced;
      }
    });
    
    gastosFinalesTemporal.forEach(item => {
      if (item.valorTipo === 'P') {
        item.valor = item.valor / 100 * this.facturaSummary.totalInvoiced;
      }
    });
    
    const gastosIniciales = gastosInicialesTemporal.map(item => item.valor);
    const gastosFinales = gastosFinalesTemporal.map(item => item.valor);

    let factura: FacturaRequestDTO | null = null;

    if (this.tasaValue == "E") {
      factura = {
        state: "ACEPTADO",
        startDate: this.fechaEmision,
        paymentDate: this.fechaVencimiento,
        discountDate: this.fechaDescuento,
        retention: this.formDescuento.get("retention")?.value,
        type: this.tasaValue,
        effectiveRate: this.formDescuento.get("effectiveRate")?.value,
        capitalization: 0,
        rateTerm: selectedValue,
        dayByYear: this.formDescuento.get("dayByYear")?.value,
        initialCosts: gastosIniciales,
        finalCosts: gastosFinales
      };
    } else if (this.tasaValue == "N") {
      factura = {
        state: "ACEPTADO",
        startDate: this.fechaEmision,
        paymentDate: this.fechaVencimiento,
        discountDate: this.fechaDescuento,
        retention: this.formDescuento.get("retention")?.value,
        type: this.tasaValue,
        effectiveRate: this.formDescuento.get("effectiveRate")?.value,
        capitalization: selectedOptionNominal,
        rateTerm: selectedValue,
        dayByYear: this.formDescuento.get("dayByYear")?.value,
        initialCosts: gastosIniciales,
        finalCosts: gastosFinales
      };
    }

    if(factura){
      this.facturaService.getEmitirFactura(factura,this.facturaId).subscribe({
        next: (data: FacturaResponseDTO)=>{
          this.facturaResponse = data;
          console.log(this.facturaResponse);
          this.router.navigate(["/factura-admin"]);
          this.snackbar.open("Emision completa","OK",{duration:2000})
        },
        error: (err)=>{
          console.log(err);
          this.snackbar.open("Emision fallida","OK",{duration:2000})
        }
      })
    }
  }
}
