import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';

// @ts-ignore
import * as bootstrap from 'bootstrap';


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

// ✅ 👉 AJOUTE CECI :
  editedCustomer!: Customer; // Contiendra le client en cours de modification
  editForm!: FormGroup;      // Formulaire pour le modal d'édition


  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    });

    this.editForm = this.fb.group({
      name: this.fb.control(''),
      email: this.fb.control('')
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

  handleEditCustomer(c: Customer) {
    this.editedCustomer = { ...c };

    // Préremplir le formulaire
    this.editForm.patchValue({
      name: c.name,
      email: c.email
    });

    // Ouvrir le modal Bootstrap
    const modalEl = document.getElementById('editCustomerModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  saveEdit() {
    const updatedCustomer: Customer = {
      ...this.editedCustomer,
      name: this.editForm.value.name,
      email: this.editForm.value.email
    };

    this.customerService.updateCustomer(updatedCustomer).subscribe({
      next: () => {
        this.customers = this.customers.pipe(
          map(data => {
            const index = data.findIndex(item => item.id === updatedCustomer.id);
            if (index !== -1) data[index] = updatedCustomer;
            return data;
          })
        );

        // Fermer le modal
        const modalEl = document.getElementById('editCustomerModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
      },
      error: err => {
        console.error('Error updating customer:', err);
        alert('Update failed');
      }
    });
  }

  // handleEditCustomer(c: Customer) {
  //   const newName = prompt('New name:', c.name);
  //   const newEmail = prompt('New email:', c.email);
  //
  //   if (newName !== null && newEmail !== null) {
  //     const updatedCustomer: Customer = {
  //       ...c,
  //       name: newName,
  //       email: newEmail
  //     };
  //
  //     this.customerService.updateCustomer(updatedCustomer).subscribe({
  //       next: () => {
  //         this.customers = this.customers.pipe(
  //           map(data => {
  //             const index = data.findIndex(item => item.id === c.id);
  //             if (index !== -1) {
  //               data[index] = updatedCustomer;
  //             }
  //             return data;
  //           })
  //         );
  //       },
  //       error: err => {
  //         console.error('Error updating customer:', err);
  //         alert('Update failed');
  //       }
  //     });
  //   }
  // }


}


