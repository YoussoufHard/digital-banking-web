import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../model/customer.model';
import {AccountsService} from '../services/accounts.service';

import { CommonModule } from '@angular/common'; // <-- Pour *ngIf, *ngFor, pipes
import { ReactiveFormsModule } from '@angular/forms'; // <-- Pour formGroup

@Component({
  selector: 'app-new-account',
  standalone: true,
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  imports: [CommonModule, ReactiveFormsModule]

})
export class NewAccountComponent implements OnInit {
  form!: FormGroup;
  customers: Customer[] = [];
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private bankService: AccountsService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      type: ['CURRENT', Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      customerId: ['', Validators.required]
    });

    this.bankService.getAllCustomers().subscribe({
      next: data => this.customers = data,
      error: err => this.errorMessage = 'Impossible de charger les clients'
    });
  }

  createAccount(): void {
    if (this.form.invalid) {
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }

    this.bankService.createAccount(this.form.value).subscribe({
      next: account => {
        alert('Compte créé avec succès (ID: ' + account.id + ')');
        this.form.reset({
          type: 'CURRENT',
          initialBalance: 0,
          customerId: ''
        });
      },
      error: err => this.errorMessage = 'Erreur lors de la création : ' + err.message
    });
  }
}
