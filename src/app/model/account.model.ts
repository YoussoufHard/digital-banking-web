import {Customer} from './customer.model';

export interface AccountDetails {
  accountId:            string;
  balance:              number;
  currentPage:          number;
  totalPages:           number;
  pageSize:             number;
  accountOperationDTOS: AccountOperation[];
}

export interface AccountOperation {
  id:            number;
  operationDate: Date;
  amount:        number;
  type:          string;
  description:   string;
}

// Ce fichier est spécifique aux comptes
export interface BankAccount {
  id: string;
  balance: number;
  createdAt: Date;
  status: string | null;
  type?: string;
  interestRate?: number;
  overdraft?: number;
  customerDTO: {
    id: number;
    name: string;
    email: string;
  };
  accountOperations?: AccountOperation[];
}
