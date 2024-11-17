import { Component } from '@angular/core';
import { FacturaService } from '../../services/factura/factura.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaSummary } from '../../models/facturaSummary';
import {  MatExpansionModule} from '@angular/material/expansion';
import {  MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TCEACarteraDTO } from '../../models/TCEACarteraDTO';
import { LoginService } from '../../../user/services/login/login.service';

// Importar pdfMake y pdfFonts
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content, TableCell } from 'pdfmake/interfaces';

// Asignar las fuentes a pdfMake
(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-factura-tcea-validation',
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, CommonModule],
  templateUrl: './factura-tcea-validation.component.html',
  styleUrl: './factura-tcea-validation.component.css'
})
export class FacturaTceaValidationComponent {
  facturaId: number = 0;
  facturaSeleccionada!: FacturaSummary;
  dsFacturas!: FacturaSummary[];
  tceaCartera!: TCEACarteraDTO;
  facturasArray: number[] =[];
  datosCargados: boolean = false;

  facturasSeleccionadas: FacturaSummary[] = [];

  constructor(private facturaService: FacturaService, private snackbar: MatSnackBar, private activatedRoute: ActivatedRoute, private loginService: LoginService) { }

  ngOnInit() {
    this.facturaId = parseInt(this.activatedRoute.snapshot.params["id"]);
    this.cargarFactura();
    this.cargarFacturasValidas();
  }

  cargarFactura(){
    this.facturaService.getFacturaById(this.facturaId).subscribe({
      next: (data: FacturaSummary) =>{
        this.facturaSeleccionada = data;
        this.facturasArray.push(this.facturaId);
        this.facturasSeleccionadas.push(data);
        this.calcularTCEACartera();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  cargarFacturasValidas(){
    this.facturaService.getFacturaValidas(this.facturaId).subscribe({
      next: (data: FacturaSummary[]) =>{
        this.dsFacturas = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getStateClass(state: String): string {
      switch (state) {
          case "ACEPTADO":
              return 'estado-aceptado';
          case "PENDIENTE":
              return 'estado-pendiente';
          case "RECHAZADO":
              return 'estado-rechazado';
          default:
              return '';
    }
  }

  calcularTCEACartera(){
    this.facturaService.getTCEAcartera(this.facturasArray).subscribe({
      next: (data: TCEACarteraDTO) =>{
        this.tceaCartera = data;
        this.verificarDatosCargados();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onCardClick(factura: FacturaSummary){
    const index = this.facturasArray.indexOf(factura.id);   
    if (index === -1) {
        this.facturasArray.push(factura.id);
        this.facturasSeleccionadas.push(factura);
        this.calcularTCEACartera();
    } else {
        this.facturasArray.splice(index, 1);
        this.facturasSeleccionadas.splice(index, 1);
        this.calcularTCEACartera();
    }
  }

  isFacturaSelected(facturaId: number): boolean {
      return this.facturasArray.includes(facturaId);
  }

  cambiarDivisaPrecio(monto: number) : String{
    return this.loginService.cambiarDivisaPrecio(monto);
  }

  verificarDatosCargados() {
    if (this.tceaCartera && this.facturaSeleccionada && this.dsFacturas.length > 0) {
      this.datosCargados = true;
    }
  }
  
// Método para generar el PDF
generatePDF() {
  if (!this.facturasSeleccionadas || this.facturasSeleccionadas.length === 0) {
    console.error('No hay facturas seleccionadas para generar el PDF.');
    return;
  }

  console.log('Generando PDF...');
  console.log('Facturas seleccionadas:', this.facturasSeleccionadas);

  const documentDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    content: [
      { text: 'Resultados', style: 'header', alignment: 'center' },
      {
        text: [
          { text: '(VR): ', bold: true },
          `Valor Total a Recibir por la cartera: ${this.cambiarDivisaPrecio(this.tceaCartera.totalValueReceived)}\n`,
          { text: '(TCEA): ', bold: true },
          `Tasa de Coste Efectiva Anual de la cartera: ${this.tceaCartera.tceaCartera}%\n`
        ]
      },
      { text: 'Lista de Facturas', style: 'subheader' },
      {
        table: {
          widths: Array(15).fill('auto'),
          body: this.buildFacturasTableBody()
        },
        layout: 'lightHorizontalLines'
      }
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 8,
        color: 'black'
      },
      tableCell: {
        fontSize: 7
      }
    }
  };

  // Generar y abrir el PDF
  pdfMake.createPdf(documentDefinition).open();
}

// Método para construir el cuerpo de la tabla de facturas
buildFacturasTableBody(): TableCell[][] {
  const body: TableCell[][] = [];

  // Cabecera de la tabla
  body.push([
    { text: 'N°', style: 'tableHeader' },
    { text: 'Fecha Giro', style: 'tableHeader' },
    { text: 'Val. Nom.', style: 'tableHeader' },
    { text: 'Fecha Ven.', style: 'tableHeader' },
    { text: 'Días', style: 'tableHeader' },
    { text: 'Retención', style: 'tableHeader' },
    { text: 'TE %', style: 'tableHeader' },
    { text: 'd %', style: 'tableHeader' },
    { text: 'Descuento', style: 'tableHeader' },
    { text: 'Coste Ini.', style: 'tableHeader' },
    { text: 'Coste Fin.', style: 'tableHeader' },
    { text: 'Val. Neto', style: 'tableHeader' },
    { text: 'Val. Rec.', style: 'tableHeader' },
    { text: 'Val. Ent.', style: 'tableHeader' },
    { text: 'TCEA %', style: 'tableHeader' }
  ]);

  // Filas de datos
  this.facturasSeleccionadas.forEach((factura, index) => {
    body.push([
      { text: index + 1, style: 'tableCell' },
      { text: factura.orderDate || 'N/A', style: 'tableCell' },
      { text: this.cambiarDivisaPrecio(factura.nominalValue) || '0.00', style: 'tableCell' },
      { text: factura.paymentDate || 'N/A', style: 'tableCell' },
      { text: factura.days || '0', style: 'tableCell' },
      { text: this.cambiarDivisaPrecio(factura.retention) || '0.00', style: 'tableCell' },
      { text: factura.newEffectiveRate || '0.00%', style: 'tableCell' },
      { text: factura.discountedRate || '0.00%', style: 'tableCell' },
      { text: this.cambiarDivisaPrecio(factura.discount) || '0.00', style: 'tableCell' },
      { text: this.cambiarDivisaPrecio(factura.initialCosts) || '0.00', style: 'tableCell' },
      { text: this.cambiarDivisaPrecio(factura.finalCosts) || '0.00', style: 'tableCell' },
      { text: this.cambiarDivisaPrecio(factura.netWorth) || '0.00', style: 'tableCell' },
      { text: this.cambiarDivisaPrecio(factura.valueReceived) || '0.00', style: 'tableCell' },
      { text: this.cambiarDivisaPrecio(factura.valueDelivered) || '0.00', style: 'tableCell' },
      { text: factura.tcea || '0.00%', style: 'tableCell' }
    ]);
  });
  return body;
}
}
