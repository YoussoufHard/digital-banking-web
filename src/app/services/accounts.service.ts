import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {map, Observable} from 'rxjs';
import { AccountDetails, AccountOperation, BankAccount } from '../model/account.model';
import { Customer } from '../model/customer.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http: HttpClient) {}
private  baseUrl =`${environment.backendHost}/accounts`
  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.baseUrl).pipe(
      map(accounts => accounts.map(acc => ({
        ...acc,
        type: acc['type'] || this.getTypeFromDiscriminator(acc)
      })))
    );
  }

  // Méthode fictive pour détecter un type (à adapter selon ton besoin réel)
  private getTypeFromDiscriminator(acc: any): string {
    // Ici tu peux adapter la logique selon ce que ton backend retourne
    if ('overDraft' in acc) return 'CurrentAccount';
    if ('interestRate' in acc) return 'SavingAccount';
    return 'Unknown';
  }

  // ✅ Méthodes EXISTANTES
  public getAccount(accountId: string, page: number, size: number): Observable<AccountDetails> {
    accountId = accountId.replace(/\s+/g, '');
    const url = `${environment.backendHost}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`;
    return this.http.get<AccountDetails>(url);
  }

  public debit(accountId: string, amount: number, description: string): Observable<any> {
    const data = { accountId, amount, description };
    return this.http.post(`${environment.backendHost}/accounts/debit`, data);
  }

  public credit(accountId: string, amount: number, description: string): Observable<any> {
    const data = { accountId, amount, description };
    return this.http.post(`${environment.backendHost}/accounts/credit`, data);
  }

  public transfer(accountSource: string, accountDestination: string, amount: number, description: string): Observable<any> {
    const data = { accountSource, accountDestination, amount, description };
    return this.http.post(`${environment.backendHost}/accounts/transfer`, data);
  }

  // ✅ MÉTHODES AJOUTÉES POUR account-list ET new-account

  // 🔍 Liste tous les comptes
  public getAllAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${environment.backendHost}/accounts`);
  }

  // 🔁 Supprimer un compte
  public deleteAccount(accountId: string): Observable<void> {
    return this.http.delete<void>(`${environment.backendHost}/accounts/${accountId}`);
  }

  // ➕ Créer un nouveau compte (courant ou épargne)
  public createAccount(accountData: any): Observable<BankAccount> {
    return this.http.post<BankAccount>(`${environment.backendHost}/accounts`, accountData);
  }

  // 👥 Liste des clients (pour formulaire création de compte)
  public getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.backendHost}/customers`);
  }
}
