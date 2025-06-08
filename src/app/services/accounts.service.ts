import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AccountDetails } from '../model/account.model';

@Injectable({
  providedIn: 'root' // ✅ Rendu disponible globalement
})
export class AccountsService {

  constructor(private http: HttpClient) {}

  public getAccount(accountId: string, page: number, size: number): Observable<AccountDetails> {
    accountId = accountId.replace(/\s+/g, '')
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
}
