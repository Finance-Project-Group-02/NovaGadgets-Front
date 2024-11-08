import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FacturaSummary } from '../../models/facturaSummary';
import { FacturaRequestDTO } from '../../models/facturaRequestDTO';
import { FacturaResponseDTO } from '../../models/facturaResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  apiUrl: string  ="http://localhost:8080/api/v1"
  recurso: string = "facturas"

  constructor(private http:HttpClient) { }
  
  getFacturas(){
    return this.http.get<FacturaSummary[]>(this.apiUrl+"/"+this.recurso+"/summaries");
  }

  getFacturaById(id: number){
    return this.http.get<FacturaSummary>(this.apiUrl+"/"+this.recurso+"/summary/"+id.toString());
  }

  getSimularFactura(factura: FacturaRequestDTO, id: number){
    return this.http.put<FacturaResponseDTO>(this.apiUrl+"/"+this.recurso+"/simular/"+id.toString(), factura);
  }

  getEmitirFactura(factura: FacturaRequestDTO, id: number){
    return this.http.put<FacturaResponseDTO>(this.apiUrl+"/"+this.recurso+"/"+id.toString(), factura);
  }

}
