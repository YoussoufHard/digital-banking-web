import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root' // 👈️ Fournit ce service à toute l'app sans configuration supplémentaire
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  public getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.backendHost}/customers`);
  }

  public searchCustomers(keyword: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.backendHost}/customers/search?keyword=${keyword}`);
  }

  public saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${environment.backendHost}/customers`, customer);
  }

  public deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.backendHost}/customers/${id}`);
  }
}
