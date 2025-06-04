import { Routes } from '@angular/router';
import { CustomerAccountsComponent } from './customer-accounts/customer-accounts.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { AccountsComponent } from './accounts/accounts.component';
import { CustomersComponent } from './customers/customers.component';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', component: CustomersComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'new-customer', component: NewCustomerComponent },
  {
    path: 'customer-accounts/:id',
    component: CustomerAccountsComponent,
    // ✅ Désactiver le prerendering pour les routes avec paramètres
    data: { prerender: false }
  },
  // ✅ Route wildcard pour gérer les URLs non trouvées
  { path: '**', redirectTo: 'customers' }
];
