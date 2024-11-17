import { Routes } from '@angular/router';
import { LoginComponent } from './user/pages/login/login.component';
import { RegisterComponent } from './user/pages/register/register.component';
import { FacturaAdminComponent } from './factura/pages/factura-admin/factura-admin.component';
import { FacturaAdminInspectionComponent } from './factura/pages/factura-admin-inspection/factura-admin-inspection.component';
import { ProductDetailComponent } from './product/pages/product-detail/product-detail.component';
import { StorePageComponent } from './product/pages/store-page/store-page.component';
import { ProductOrderComponent } from './product/pages/product-order/product-order.component';
import { FacturaClientComponent } from './factura/pages/factura-client/factura-client.component';

import { HomeComponent } from './public/pages/home/home.component';
import { loginGuard } from './guards/login/login.guard';
import { authGuard } from './guards/auth/auth.guard';
import { PerfilComponent } from './user/pages/perfil/perfil.component';
import { ShoppingProductCartComponent } from './product/pages/shopping-product-cart/shopping-product-cart.component';
import { ShoppingCartPayComponent } from './product/pages/shopping-cart-pay/shopping-cart-pay.component';
import { FacturaTceaComponent } from './factura/pages/factura-tcea/factura-tcea.component';
import { FacturaTceaValidationComponent } from './factura/pages/factura-tcea-validation/factura-tcea-validation.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },//TODOS
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },//TODOS
    { path: 'register', component: RegisterComponent, canActivate: [loginGuard] },//TODOS
    { path: 'home', component: HomeComponent, canActivate: [authGuard] }, //TODOS
    { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },//TODOS
    { path: "factura-admin", component: FacturaAdminComponent, canActivate: [authGuard], data: { role: 'ADMIN' } },//ADMIN
    { path: "factura-client", component: FacturaClientComponent, canActivate: [authGuard], data: { role: 'CLIENT' } },//CLIENTE
    { path: "factura-tcea", component: FacturaTceaComponent, canActivate: [authGuard], data: { role: 'ADMIN' }},
    { path: "factura-tcea-validation/:id", component: FacturaTceaValidationComponent, canActivate: [authGuard], data: { role: 'ADMIN' }},
    { path: "factura-admin-inspection/:id", component: FacturaAdminInspectionComponent, canActivate: [authGuard], data: { role: 'ADMIN' }},//ADMIN
    { path: "store-page", component: StorePageComponent,canActivate: [authGuard], data: { role: 'CLIENT' } },//CLIENTE
    { path: "product-detail/:id", component: ProductDetailComponent, canActivate: [authGuard], data: { role: 'CLIENT' } },//CLIENTE
    { path: 'product-order/:id', component: ProductOrderComponent, canActivate: [authGuard], data: { role: 'CLIENT' } },//CLIENTE
    { path: 'carrito', component: ShoppingProductCartComponent, canActivate: [authGuard], data: { role: 'CLIENT' } },//CLIENTE
    { path: 'carrito-compra', component: ShoppingCartPayComponent, canActivate: [authGuard], data: { role: 'CLIENT' }},//CLIENTE
    { path: 'detalle-compra', component: ProductOrderComponent, canActivate: [authGuard], data: { role: 'CLIENT' } },//CLIENTE
    { path: '**', redirectTo: 'home' },
];