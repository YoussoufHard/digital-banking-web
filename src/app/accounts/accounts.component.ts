import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountsService } from '../services/accounts.service';
import { catchError, Observable, throwError } from 'rxjs';
import { AccountDetails } from '../model/account.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // ici on importe les modules nécessaires
})
export class AccountsComponent {
  accountFormGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable!: Observable<AccountDetails>;
  operationFromGroup!: FormGroup;
  errorMessage!: string;

  constructor(private fb: FormBuilder, private accountService: AccountsService) {}

  ngOnInit(): void {
    this.accountFormGroup = this.fb.group({
      accountId: this.fb.control(''),
    });
    this.operationFromGroup = this.fb.group({
      operationType: this.fb.control(null),
      amount: this.fb.control(0),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null),
    });
  }

  handleSearchAccount() {
    let accountId: string = this.accountFormGroup.value.accountId;
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
    let accountId: string = this.accountFormGroup.value.accountId;
    let operationType = this.operationFromGroup.value.operationType;
    let amount: number = this.operationFromGroup.value.amount;
    let description: string = this.operationFromGroup.value.description;
    let accountDestination: string = this.operationFromGroup.value.accountDestination;

    if (operationType === 'DEBIT') {
      this.accountService.debit(accountId, amount, description).subscribe({
        next: () => {
          alert('Success Debit');
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else if (operationType === 'CREDIT') {
      this.accountService.credit(accountId, amount, description).subscribe({
        next: () => {
          alert('Success Credit');
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else if (operationType === 'TRANSFER') {
      this.accountService.transfer(accountId, accountDestination, amount, description).subscribe({
        next: () => {
          alert('Success Transfer');
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
