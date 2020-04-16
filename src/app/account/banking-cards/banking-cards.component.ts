import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../../services/data.service';
import {AppService} from '../../app.service';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AccountModel} from '../../../models/Account.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-banking-cards',
  templateUrl: './banking-cards.component.html',
  styleUrls: ['./banking-cards.component.scss']
})
export class BankingCardsComponent implements OnInit {
  accountForm: FormGroup;
  currentDate = new Date();
  openItem: string;
  month: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years: string[] = [this.currentDate.getFullYear().toString(), (this.currentDate.getFullYear() + 1).toString(), (this.currentDate.getFullYear() + 2).toString(),
    (this.currentDate.getFullYear() + 3).toString(), (this.currentDate.getFullYear() + 4).toString(), (this.currentDate.getFullYear() + 5).toString(), (this.currentDate.getFullYear() + 6).toString(),
    (this.currentDate.getFullYear() + 7).toString(), (this.currentDate.getFullYear() + 8).toString(), (this.currentDate.getFullYear() + 9).toString(), (this.currentDate.getFullYear() + 10).toString()];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  filteredOptionsYears: Observable<string[]>;
  accounts: AccountModel[] = [];

  constructor(private restService: DataService,
              private fb: FormBuilder,
              private appService: AppService,
              private dialog: MatDialog,
              private toastr: ToastrService) {

  }

  get f() {
    return this.accountForm.controls;
  }

  prepare() {
    this.accountForm = this.fb.group({
      owner_name: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      expiry_date: [''],
      card_number: ['', Validators.required],
      cvc: ['', Validators.required],
      type: ['']
    });
  }

  getSelectedItem(item) {
    this.openItem = item.account_id;
    this.accountForm.patchValue(item);
    this.f.month.setValue((this.f.expiry_date.value).slice(0 , 2 ));
    this.f.year.setValue((this.f.expiry_date.value).slice(3 , 7 ));
  }

  checkCVV() {
    if (this.f.cvc.value.toString().length >= 3) {
      this.f.cvc.setValue(+(this.f.cvc.value.toString().slice(0, 2)));
    }
  }

  addAccount() {
    this.f.type.setValue(1);
    this.f.expiry_date.setValue(this.f.month.value + '/' + this.f.year.value);
    let model: AccountModel = this.accountForm.value as AccountModel;
    this.restService.addAccount(model).then((res) => {
      if (res.code === 200) {
        this.accounts.push(res.data);
        this.accountForm.reset();
        Object.keys(this.accountForm.controls).forEach(key => {
          this.accountForm.controls[key].setErrors(null);
        });
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  getAccount() {
    this.restService.getAccounts().then((res) => {
      if (res.code === 200) {
        this.accounts = res.data;
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  removeAccount(item: AccountModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete the billing record ending in ****-' + item.card_number.toString().slice(item.card_number.toString().length - 4, item.card_number.toString().length) + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    })
      .then(result => {
        if (result.value) {
          this.deleteBankAccount(item.account_id);

        } else {
          Swal.fire(
            'Cancelled',
            '',
            'error'
          );
        }
      });
  }

  deleteBankAccount(id) {
    // tslint:disable-next-line:prefer-const
    this.restService.deleteBankAccount(id).then((res) => {
      if (res.code === 200) {
        this.accounts = this.accounts.filter(account => account.account_id !== id);
        Swal.fire(
          'Deleted!',
          'Your account has been deleted.',
          'success'
        );
      } else {
        this.toastr.error(res.message, '');

      }

    }).catch((err: HttpErrorResponse) => {

    });
  }


  ngOnInit() {
    this.prepare();
    this.getAccount();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filteredOptionsYears = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterYear(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.month.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterYear(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.years.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}
