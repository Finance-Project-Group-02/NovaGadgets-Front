import { Routes } from '@angular/router';
import { LoginComponent } from './user/pages/login/login.component';
import { RegisterComponent } from './user/pages/register/register.component';
import { FacturaAdminComponent } from './factura/pages/factura-admin/factura-admin.component';
import { FacturaAdminInspectionComponent } from './factura/pages/factura-admin-inspection/factura-admin-inspection.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: "factura-admin", component: FacturaAdminComponent},
    { path: "factura-admin-inspection/:id", component: FacturaAdminInspectionComponent},
    { path: '**', redirectTo: 'login' },
];