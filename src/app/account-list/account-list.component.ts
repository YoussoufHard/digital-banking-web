import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../services/accounts.service';
import { BankAccount } from '../model/account.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AccountListComponent implements OnInit {

  accounts: BankAccount[] = [];
  filteredAccounts: BankAccount[] = [];
  errorMessage: string = '';
  searchFormGroup!: FormGroup;

  constructor(
    private bankService: AccountsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: ['']
    });
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.bankService.getAllAccounts().pipe(
      catchError(err => {
        this.errorMessage = 'Erreur lors du chargement des comptes.';
        return of([]);
      })
    ).subscribe(accounts => {
      console.log("Comptes récupérés : ", accounts); // 👈 Ajout temporaire
      this.accounts = accounts;
      this.filteredAccounts = accounts;
    });
  }

  handleSearch(): void {
    const keyword = this.searchFormGroup.value.keyword?.toLowerCase();
    if (!keyword) {
      this.filteredAccounts = this.accounts;
      return;
    }

    this.filteredAccounts = this.accounts.filter(acc =>
      acc.id.toLowerCase().includes(keyword) ||
      acc.type?.toLowerCase().includes(keyword) ||
      acc.customerDTO?.name?.toLowerCase().includes(keyword)
    );
  }

  deleteAccount(id: string): void {
    if (confirm("Voulez-vous vraiment supprimer ce compte ?")) {
      this.bankService.deleteAccount(id).subscribe({
        next: () => this.loadAccounts(),
        error: err => alert('Échec de la suppression : ' + err.message)
      });
    }
  }

  openOperations(id: string): void {
    this.router.navigate(['/account', id]);
  }
}
