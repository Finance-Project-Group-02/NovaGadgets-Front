import { Routes } from '@angular/router';
import { LoginComponent } from './user/pages/login/login.component';
import { RegisterComponent } from './user/pages/register/register.component';
import { FacturaAdminComponent } from './factura/pages/factura-admin/factura-admin.component';
import { FacturaAdminInspectionComponent } from './factura/pages/factura-admin-inspection/factura-admin-inspection.component';
import { ProductDetailComponent } from './product/pages/product-detail/product-detail.component';
import { StorePageComponent } from './product/pages/store-page/store-page.component';
import { ProductOrderComponent } from './product/pages/product-order/product-order.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: "factura-admin", component: FacturaAdminComponent},
    { path: "factura-admin-inspection/:id", component: FacturaAdminInspectionComponent},
    { path: "store-page", component: StorePageComponent},
    { path: "product-detail/:id", component: ProductDetailComponent }, // Nueva ruta
    { path: 'product-order/:id', component: ProductOrderComponent }, // Nueva ruta con ID
    { path: '**', redirectTo: 'login' },
];