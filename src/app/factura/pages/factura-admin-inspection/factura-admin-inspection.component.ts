import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


import { FacturaResponseDTO } from '../../models/facturaResponseDTO';
import { FacturaRequestDTO } from '../../models/facturaRequestDTO';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaSummary } from '../../models/facturaSummary';
import { FacturaService } from '../../services/factura/factura.service';
import { LoginService } from '../../../user/services/login/login.service';
import { CostDTO } from '../../models/costDTO';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2'; // Importar SweetAlert2

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
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './factura-admin-inspection.component.html',
  styleUrls: ['./factura-admin-inspection.component.css']
})
export class FacturaAdminInspectionComponent implements OnInit {
  formDescuento!: FormGroup;
  facturaResponse!: FacturaResponseDTO;
  facturaSummary!: FacturaSummary;
  evaluar = false;
  evaluacionValida = false;
  tasaValue: string = "E";
  facturaId: number = 0;

  // Fechas
  fechaEmision!: string;
  fechaDescuento!: string;
  fechaVencimiento!: string;

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
    { value: 360, label: 'Anual' },
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
    { name: 'Otros gastos' }
  ];

  addedGastosIniciales: CostDTO[] = [];
  addedGastosFinales: CostDTO[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private facturaService: FacturaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.cargarFormulario();
  }

  //Mensajes
  generarMensajePrincipal(){
    Swal.fire({
      icon: 'question',
      text: 'En esta sección podrá simular el descuento de la factura. Si está conforme con la simulación, deberá emitir la factura para cambiar su estado a "Aceptado". Es importante tener en cuenta que, al trabajar con una factura, se utiliza el Valor Nominal, es decir, el monto total menos el IGV (18%)',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar'
    });
  }
  generarMensajeCosteIniciales(){
    Swal.fire({
      icon: 'question',
      text: 'Estos corresponden a los costos o gastos que deben pagarse al acreedor para realizar la operación, y que se agregarán al Valor Neto (la diferencia entre el Valor Nominal y el Descuento). Puede elegir ingresar estos montos como un porcentaje o como un valor efectivo. Estos gastos afectarán el cálculo de la Tasa de Costo Efectivo Anual (TCEA).',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar'
    });
  }
  generarMensajeCosteFinales(){
    Swal.fire({
      icon: 'question',
      text: 'Estos corresponden a los costos o gastos que deben pagarse al acreedor al finalizar la operación y que se agregarán al Valor Nominal. Puede elegir entre ingresar el monto en forma de porcentaje o como valor efectivo. Estos montos afectarán el cálculo de la Tasa de Costo Efectivo Anual (TCEA)',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar'
    });
  }
  generarMensajeTasaPlazo(){
    Swal.fire({
      icon: 'question',
      text: 'En esta sección podrá seleccionar el número de días por año, el plazo o período de la tasa, el valor de la tasa de interés con la que se compensará al acreedor, y la fecha de descuento, que es el día en que se descontará el instrumento financiero',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar'
    });
  }
  generarMensajeDatosFactura(){
    Swal.fire({
      icon: 'question',
      text: 'En esta sección podrá seleccionar la Fecha de Pago, que corresponde al vencimiento del compromiso originado por la factura, así como el valor retenido por el acreedor. Es importante señalar que la Fecha de Emisión es la misma que la de creación de la factura, y el Valor Nominal es el monto total menos el IGV (18%). Ambos valores no podrán ser modificados.',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar'
    });
  }

  cargarFormulario() {
    this.facturaId = this.activatedRoute.snapshot.params["id"];
    this.formDescuento = this.formBuilder.group({
      type: ["E", [Validators.required]],
      startDate: ["", [Validators.required]],
      paymentDate: ["", [Validators.required]],
      totalInvoiced: ["", [Validators.required]],
      retention: ["", [Validators.required, Validators.min(0)]],

      dayByYear: ["", [Validators.required]],
      rateTerm: ["", [Validators.required]],
      effectiveRate: ["", [Validators.required]],
      nominalRate: ["", [Validators.required]],
      discountDate: ["", [Validators.required]],
      especialRate: [""],
      capitalization: [""],
      especialRateCapitalization: [""],

      gastoInicial: [""],
      valorTipoInicial: [""],
      valorInicial: [""],

      gastoFinal: [""],
      valorTipoFinal: [""],
      valorFinal: [""],
    });

    // Deshabilitamos los campos de tasa nominal por defecto
    this.formDescuento.get('nominalRate')?.disable();
    this.formDescuento.get('capitalization')?.disable();

    this.facturaService.getFacturaById(this.facturaId).subscribe({
      next: (data: FacturaSummary) => {
        this.facturaSummary = data;

        let fechaDate: Date = new Date(data.orderDate + 'T00:00:00');
        this.formDescuento.get("startDate")?.setValue(fechaDate);
        this.formDescuento.get("totalInvoiced")?.setValue(data.nominalValue);
        this.formDescuento.get('startDate')?.disable();
        this.formDescuento.get('totalInvoiced')?.disable();
      },
      error: (err) => {
        console.log(err);
      }
    });

    // Gastos Iniciales
    this.facturaService.getFacturaById(this.facturaId).subscribe({
      next: (data: FacturaSummary) => {
        this.facturaSummary = data;
    
        let fechaDate: Date = new Date(data.orderDate + 'T00:00:00');
        this.formDescuento.get("startDate")?.setValue(fechaDate);
        this.formDescuento.get("totalInvoiced")?.setValue(data.nominalValue);
        this.formDescuento.get('startDate')?.disable();
        this.formDescuento.get('totalInvoiced')?.disable();
      },
      error: (err) => {
        console.log(err);
      }
    });
    
    // Gastos Iniciales
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
    
    // Gastos Finales
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
    
    // Control de validación para campos especiales
    this.formDescuento.get('rateTerm')?.valueChanges.subscribe(value => {
      if (value === 'especial') {
        this.formDescuento.get('especialRate')?.setValidators([Validators.required]);
      } else {
        this.formDescuento.get('especialRate')?.clearValidators();
        this.formDescuento.get('especialRate')?.setValue('');
      }
      this.formDescuento.get('especialRate')?.updateValueAndValidity();
    });
    
    this.formDescuento.get('capitalization')?.valueChanges.subscribe(value => {
      if (value === 'especial') {
        this.formDescuento.get('especialRateCapitalization')?.setValidators([Validators.required]);
      } else {
        this.formDescuento.get('especialRateCapitalization')?.clearValidators();
        this.formDescuento.get('especialRateCapitalization')?.setValue('');
      }
      this.formDescuento.get('especialRateCapitalization')?.updateValueAndValidity();
    });
    
    // Control de tipo de tasa
    this.formDescuento.get('type')?.valueChanges.subscribe(value => {
      if (value === 'N') {
        this.tasaValue = 'N';
    
        // Habilitar y establecer validadores
        this.formDescuento.get('nominalRate')?.enable();
        this.formDescuento.get('capitalization')?.enable();
        this.formDescuento.get('nominalRate')?.setValidators([Validators.required]);
        this.formDescuento.get('capitalization')?.setValidators([Validators.required]);
    
        // Deshabilitar y limpiar validadores
        this.formDescuento.get('effectiveRate')?.disable();
        this.formDescuento.get('effectiveRate')?.clearValidators();
        this.formDescuento.get('effectiveRate')?.setValue('');
    
        // Actualizar el estado de validación
        this.formDescuento.get('nominalRate')?.updateValueAndValidity();
        this.formDescuento.get('capitalization')?.updateValueAndValidity();
        this.formDescuento.get('effectiveRate')?.updateValueAndValidity();
      } else {
        this.tasaValue = 'E';
    
        // Deshabilitar y limpiar validadores
        this.formDescuento.get('nominalRate')?.disable();
        this.formDescuento.get('capitalization')?.disable();
        this.formDescuento.get('nominalRate')?.clearValidators();
        this.formDescuento.get('capitalization')?.clearValidators();
        this.formDescuento.get('nominalRate')?.setValue('');
        this.formDescuento.get('capitalization')?.setValue('');
        this.formDescuento.get('especialRateCapitalization')?.setValue('');
    
        // Habilitar y establecer validadores
        this.formDescuento.get('effectiveRate')?.enable();
        this.formDescuento.get('effectiveRate')?.setValidators([Validators.required]);
    
        // Actualizar el estado de validación
        this.formDescuento.get('nominalRate')?.updateValueAndValidity();
        this.formDescuento.get('capitalization')?.updateValueAndValidity();
        this.formDescuento.get('effectiveRate')?.updateValueAndValidity();
      }
    });

    this.formDescuento.get('valorTipoInicial')?.disable();
    this.formDescuento.get('valorInicial')?.disable();

    // Gastos Finales
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

    // Control de validación para campos especiales
    this.formDescuento.get('rateTerm')?.valueChanges.subscribe(value => {
      if (value === 'especial') {
        this.formDescuento.get('especialRate')?.setValidators([Validators.required]);
      } else {
        this.formDescuento.get('especialRate')?.clearValidators();
        this.formDescuento.get('especialRate')?.setValue('');
      }
      this.formDescuento.get('especialRate')?.updateValueAndValidity();
    });

    this.formDescuento.get('capitalization')?.valueChanges.subscribe(value => {
      if (value === 'especial') {
        this.formDescuento.get('especialRateCapitalization')?.setValidators([Validators.required]);
      } else {
        this.formDescuento.get('especialRateCapitalization')?.clearValidators();
        this.formDescuento.get('especialRateCapitalization')?.setValue('');
      }
      this.formDescuento.get('especialRateCapitalization')?.updateValueAndValidity();
    });

    // Control de tipo de tasa
    this.formDescuento.get('type')?.valueChanges.subscribe(value => {
      if (value === 'N') {
        this.formDescuento.get('nominalRate')?.enable();
        this.formDescuento.get('capitalization')?.enable();
        this.formDescuento.get('effectiveRate')?.disable();
        this.formDescuento.get('effectiveRate')?.clearValidators();
        this.formDescuento.get('effectiveRate')?.setValue('');
        this.formDescuento.get('effectiveRate')?.updateValueAndValidity();
      } else {
        this.formDescuento.get('nominalRate')?.disable();
        this.formDescuento.get('capitalization')?.disable();
        this.formDescuento.get('nominalRate')?.setValue('');
        this.formDescuento.get('capitalization')?.setValue('');
        this.formDescuento.get('especialRateCapitalization')?.setValue('');
        this.formDescuento.get('nominalRate')?.clearValidators();
        this.formDescuento.get('nominalRate')?.updateValueAndValidity();
        this.formDescuento.get('capitalization')?.updateValueAndValidity();
        this.formDescuento.get('effectiveRate')?.enable();
        this.formDescuento.get('effectiveRate')?.setValidators([Validators.required]);
        this.formDescuento.get('effectiveRate')?.updateValueAndValidity();
      }
    });
  }

  actualizarTipo(event: any) {
    this.tasaValue = event.value;
  }

  convertirDateToString(fechaDate: Date): string {
    const year = fechaDate.getFullYear();
    const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  selectionChange(event: any) {
    this.selectedOption = event.value;
  }

  selectionChangeNominal(event: any) {
    this.selectedOptionNominal = event.value;
  }

  agregarGastoInicial() {
    const gastoSeleccionado = this.formDescuento.get("gastoInicial")?.value;
    const valorTipo = this.formDescuento.get("valorTipoInicial")?.value;
    const valor = this.formDescuento.get("valorInicial")?.value;

    if (gastoSeleccionado && valorTipo && valor) {
      this.addedGastosIniciales.push(
        { id: 0, name: gastoSeleccionado, type: valorTipo, value: valor }
      );

      this.formDescuento.get("gastoInicial")?.reset();
      this.formDescuento.get("valorTipoInicial")?.reset();
      this.formDescuento.get("valorInicial")?.reset();
      this.formDescuento.get('valorTipoInicial')?.disable();
      this.formDescuento.get('valorInicial')?.disable();
    } else {
      this.snackbar.open("Complete todos los campos del gasto inicial", "OK", { duration: 2000 });
    }
  }

  eliminarGastoInicial(index: number) {
    this.addedGastosIniciales.splice(index, 1);
  }

  agregarGastoFinal() {
    const gastoSeleccionado = this.formDescuento.get("gastoFinal")?.value;
    const valorTipo = this.formDescuento.get("valorTipoFinal")?.value;
    const valor = this.formDescuento.get("valorFinal")?.value;

    if (gastoSeleccionado && valorTipo && valor) {
      this.addedGastosFinales.push(
        { id: 0, name: gastoSeleccionado, type: valorTipo, value: valor }
      );

      this.formDescuento.get("gastoFinal")?.reset();
      this.formDescuento.get("valorTipoFinal")?.reset();
      this.formDescuento.get("valorFinal")?.reset();
      this.formDescuento.get('valorTipoFinal')?.disable();
      this.formDescuento.get('valorFinal')?.disable();
    } else {
      this.snackbar.open("Complete todos los campos del gasto final", "OK", { duration: 2000 });
    }
  }

  eliminarGastoFinal(index: number) {
    this.addedGastosFinales.splice(index, 1);
  }

  canAddGastoInicial(): boolean {
    return (this.formDescuento.get('gastoInicial')?.valid ?? false) &&
           (this.formDescuento.get('valorTipoInicial')?.valid ?? false) &&
           (this.formDescuento.get('valorInicial')?.valid ?? false);
  }
  
  canAddGastoFinal(): boolean {
    return (this.formDescuento.get('gastoFinal')?.valid ?? false) &&
           (this.formDescuento.get('valorTipoFinal')?.valid ?? false) &&
           (this.formDescuento.get('valorFinal')?.valid ?? false);
  }

  Regresar() {
    this.evaluar = false;
    this.evaluacionValida = false;
  }

  evaluarFactura() {
    if (this.formDescuento.invalid) {
      this.snackbar.open("Complete todos los campos requeridos", "OK", { duration: 2000 });
      return;
    }

    this.evaluar = true;

    let selectedValue;
    let selectedOptionNominal;

    let fechaEmision = this.formDescuento.get("startDate")?.value;
    let fechaPago = this.formDescuento.get("paymentDate")?.value;
    let fechaDescuento = this.formDescuento.get("discountDate")?.value;

    this.fechaEmision = this.convertirDateToString(fechaEmision);
    this.fechaVencimiento = this.convertirDateToString(fechaPago);
    this.fechaDescuento = this.convertirDateToString(fechaDescuento);

    const rateTermValue = this.formDescuento.get("rateTerm")?.value;
    if (rateTermValue === 'especial') {
      selectedValue = this.formDescuento.get("especialRate")?.value;
    } else {
      selectedValue = rateTermValue;
    }

    const rateTermNominal = this.formDescuento.get("capitalization")?.value;
    if (rateTermNominal === 'especial') {
      selectedOptionNominal = this.formDescuento.get("especialRateCapitalization")?.value;
    } else {
      selectedOptionNominal = rateTermNominal;
    }

    let factura: FacturaRequestDTO | null = null;

    if (this.tasaValue === "E") {
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
        initialCosts: this.addedGastosIniciales,
        finalCosts: this.addedGastosFinales
      };
    } else if (this.tasaValue === "N") {
      factura = {
        state: "PENDIENTE",
        startDate: this.fechaEmision,
        paymentDate: this.fechaVencimiento,
        discountDate: this.fechaDescuento,
        retention: this.formDescuento.get("retention")?.value,
        type: this.tasaValue,
        effectiveRate: this.formDescuento.get("nominalRate")?.value,
        capitalization: selectedOptionNominal,
        rateTerm: selectedValue,
        dayByYear: this.formDescuento.get("dayByYear")?.value,
        initialCosts: this.addedGastosIniciales,
        finalCosts: this.addedGastosFinales
      };
    }

    if (factura) {
      this.facturaService.getSimularFactura(factura, this.facturaId).subscribe({
        next: (data: FacturaResponseDTO) => {
          this.facturaResponse = data;
          this.evaluacionValida = true;
          this.snackbar.open("Simulación completa", "OK", { duration: 2000 });
        },
        error: (err) => {
          console.log(err);
          this.snackbar.open("Simulación fallida", "OK", { duration: 2000 });
        }
      });
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

    const rateTermNominal = this.formDescuento.get("capitalization")?.value;
    if (rateTermNominal === 'especial') {
      selectedOptionNominal = this.formDescuento.get("especialRateCapitalization")?.value;
    } else {
      selectedOptionNominal = this.options.find(option => option.value === rateTermNominal)?.value;
    }
    
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
        initialCosts: this.addedGastosIniciales,
        finalCosts: this.addedGastosFinales
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
        initialCosts: this.addedGastosIniciales,
        finalCosts: this.addedGastosFinales
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

  cambiarDivisaPrecio(monto: number) : String{
    return this.loginService.cambiarDivisaPrecio(monto);
  }
}