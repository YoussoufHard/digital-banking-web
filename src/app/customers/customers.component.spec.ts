import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomersComponent } from './customers.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';

describe('CustomersComponent', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;
  let customerServiceSpy: jasmine.SpyObj<CustomerService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Création des mocks
    customerServiceSpy = jasmine.createSpyObj('CustomerService', ['searchCustomers', 'deleteCustomer']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        CustomersComponent, // ⚠️ Standalone component, on l'importe directement
        CommonModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Mock du retour de recherche
    customerServiceSpy.searchCustomers.and.returnValue(of([]));

    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchCustomers on init', () => {
    expect(customerServiceSpy.searchCustomers).toHaveBeenCalled();
  });

  it('should handle deleteCustomer correctly', () => {
    const mockCustomer: Customer = { id: 1, name: 'John Doe', email: 'john@example.com' };
    spyOn(window, 'confirm').and.returnValue(true); // simule le clic sur "OK"
    customerServiceSpy.deleteCustomer.and.returnValue(of({}));

    component.customers = of([mockCustomer]);
    component.handleDeleteCustomer(mockCustomer);

    expect(customerServiceSpy.deleteCustomer).toHaveBeenCalledWith(mockCustomer.id);
  });
});
