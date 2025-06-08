import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root' // Fournit ce service à toute l'app sans configuration supplémentaire
})
export class CustomerService {
  private apiUrl = environment.backendHost + '/customers';

  constructor(private http: HttpClient) {}

  public getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  public searchCustomers(keyword: string): Observable<Customer[]> {
    const encodedKeyword = encodeURIComponent(keyword);
    return this.http.get<Customer[]>(`${this.apiUrl}/search?keyword=${encodedKeyword}`);
  }

  public saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  public deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public updateCustomer(customer: Customer): Observable<any> {
    return this.http.put(`${environment.backendHost}/customers/${customer.id}`, customer);
  }

}

