import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup: FormGroup | undefined;

  // ✅ Syntaxe moderne Angular 19 avec inject()
  private customerService = inject(CustomerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    });
    this.handleSearchCustomers();
  }

  handleSearchCustomers() {
    const kw = this.searchFormGroup?.value.keyword || '';
    this.customers = this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(() => err);
      })
    );
  }

  handleDeleteCustomer(c: Customer) {
    const conf = confirm('Are you sure?');
    if (!conf) return;

    this.customerService.deleteCustomer(c.id).subscribe({
      next: () => {
        this.customers = this.customers.pipe(
          map(data => {
            const index = data.indexOf(c);
            if (index > -1) {
              data.splice(index, 1);
            }
            return data;
          })
        );
      },
      error: err => {
        console.error('Error deleting customer:', err);
      }
    });
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl('/customer-accounts/' + customer.id, { state: customer });
  }
}
