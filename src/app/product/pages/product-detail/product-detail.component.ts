import { Component } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product = {
    id: 1,
    name: "AULA F3261 Type-C Hot Swappable RGB Mechanical Gaming Keyboard",
    mainImage: "ruta_a_la_imagen_principal",
    images: [
        "ruta_a_la_imagen1",
        "ruta_a_la_imagen2",
        "ruta_a_la_imagen3"
    ],
    price: 123.90,
    originalPrice: 134.90,
    discount: 8,
    model: "F3261",
    switchType: "Blue Switch",
    keysCount: 61,
    rgbEffects: "19 RGB Effects",
    connectorType: "Type-C",
    colors: ["Black", "White", "Blue"],
    store: [{ id: 1, name: "Aula", store_ruc: "123456789" }],
    categoria: [{ id: 1, name: "Keyboard" }]
};
}
