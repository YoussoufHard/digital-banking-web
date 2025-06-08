import { Routes } from '@angular/router';
import { CustomerAccountsComponent } from './customer-accounts/customer-accounts.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { AccountsComponent } from './accounts/accounts.component'; // Pour opérations sur compte
import { CustomersComponent } from './customers/customers.component';
import { AccountListComponent } from './account-list/account-list.component'; // ➕ à ajouter
import { NewAccountComponent } from './new-account/new-account.component';     // ➕ à ajouter
import { LoginComponent } from './login/login.component'; // Ajoute ton LoginComponent ici

export const routes: Routes = [
  // Redirection racine vers login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent }, // page login

  { path: 'customers', component: CustomersComponent },
  { path: 'new-customer', component: NewCustomerComponent },
  { path: 'customer-accounts/:id', component: CustomerAccountsComponent, data: { prerender: false } },

  // Gestion des comptes
  { path: 'accounts', component: AccountListComponent },          // Liste/recherche des comptes
  { path: 'new-account', component: NewAccountComponent },        // Création de compte
  { path: 'account/:id', component: AccountsComponent },          // Opérations sur compte

  // Wildcard - routes inconnues redirigées vers 'customers' (ou autre)
  { path: '**', redirectTo: 'customers' }
];
