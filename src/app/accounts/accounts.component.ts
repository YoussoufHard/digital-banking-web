import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountsService } from '../services/accounts.service';
import { catchError, Observable, throwError } from 'rxjs';
import { AccountDetails } from '../model/account.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AccountsComponent {
  accountFormGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable!: Observable<AccountDetails>;
  operationFromGroup!: FormGroup;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // ← Récupère l'ID depuis /account/:id

    this.accountFormGroup = this.fb.group({
      accountId: this.fb.control(id || '', Validators.required)
    });

    this.operationFromGroup = this.fb.group({
      operationType: this.fb.control(null),
      amount: this.fb.control(0),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null),
    });

    if (id) {
      this.handleSearchAccount(); // ← Lance la recherche si un ID est fourni
    }
  }

  handleSearchAccount() {
    const accountId: string = this.accountFormGroup.value.accountId;
    this.accountObservable = this.accountService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError((err) => {
        this.errorMessage = err.message;
        return throwError(() => err);
      })
    );
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
    const accountId: string = this.accountFormGroup.value.accountId;
    const operationType = this.operationFromGroup.value.operationType;
    const amount: number = this.operationFromGroup.value.amount;
    const description: string = this.operationFromGroup.value.description;
    const accountDestination: string = this.operationFromGroup.value.accountDestination;

    switch (operationType) {
      case 'DEBIT':
        this.accountService.debit(accountId, amount, description).subscribe({
          next: () => {
            alert('Success Debit');
            this.operationFromGroup.reset();
            this.handleSearchAccount();
          },
          error: (err) => console.error(err)
        });
        break;
      case 'CREDIT':
        this.accountService.credit(accountId, amount, description).subscribe({
          next: () => {
            alert('Success Credit');
            this.operationFromGroup.reset();
            this.handleSearchAccount();
          },
          error: (err) => console.error(err)
        });
        break;
      case 'TRANSFER':
        this.accountService.transfer(accountId, accountDestination, amount, description).subscribe({
          next: () => {
            alert('Success Transfer');
            this.operationFromGroup.reset();
            this.handleSearchAccount();
          },
          error: (err) => console.error(err)
        });
        break;
    }
  }
}
