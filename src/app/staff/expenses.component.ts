import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { moveIn, fallIn } from '../shared/router.animation';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
// import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BackendService } from '../services/backend.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit, OnDestroy {

  members: any[];
  dataSource: MatTableDataSource<any>;
  myDocData;
  data$;
  toggleField: string;
  state: string = '';
  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;
  private querySubscription;

  statusCDs = ['OPEN', 'CLOSED', 'PAID', 'PENDING', 'HOLD', 'CANCELLED'];
  typeCDs = ['REGULAR', 'RECURRING', 'DIRECT INVOICE', 'EXPEDITE', 'OTHER', 'EXPENSE'];
  discCDs = ['%', 'Fixed'];
  total_amount = 0;
  addDataForm: FormGroup;
  editDataForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['code', 'descr', '_id'];


  constructor(private _backendService: BackendService, private _fb: FormBuilder) { }

  ngOnInit() {
    this.toggleField = "searchMode";
    this.error = false;
    this.errorMessage = "";
    this.dataSource = new MatTableDataSource(this.members);
    this.addDataForm = this._fb.group({
      code: ['', Validators.required],
      descr: ['', Validators.required],
      TYPE: ['', Validators.required],
      STATUS: ['', Validators.required],
      INVOICE: [''],
      VENDOR: [''],
      ADDRESS: this._fb.array([this._fb.group({
        ADD_TYPE: '',
        ADD_LINE_1: '',
        ADD_LINE_2: '',
        PIN_CODE: '',
        STATE: '',
        COUNTRY: ''
      })]),
      PHONE: this._fb.array([this._fb.group({
        PHONE_TYPE: '',
        PHONE_NUMBER: ['', [Validators.pattern("^[0-9]*$")]]
      })]),
      EMAILID: this._fb.array([this._fb.group({
        EMAIL_TYPE: '',
        EMAILID: ''
      })]),
      EDATE: '',
      RDATE: '',
      DDATE: '',
      PDATE: '',
      LINE: this._fb.array([this._fb.group({
        LINE_NUM: '',
        LINE_NAME: '',
        AMOUNT: ['', [Validators.pattern("^[0-9]*$")]]
      })]),
      GAMOUNT: '',
      GAMOUNT_DISC_TYPE: '',
      DISC_G_PERCENT: '',
      DISC_GAMOUNT: '',
      TAX_TYPE: '',
      TAX_PERCENT: '',
      TAX_GAMOUNT: '',
      SHIP_TYPE: '',
      SHIP_PERCENT: '',
      SHIP_GAMOUNT: '',
      FINAL_AMOUNT: '',
      PAID_AMOUNT: '',
      BALANCE: ''
    });
    this.editDataForm = this._fb.group({
      code: ['', Validators.required],
      descr: ['', Validators.required],
      TYPE: ['', Validators.required],
      STATUS: ['', Validators.required],
      INVOICE: [''],
      VENDOR: [''],
      ADDRESS: this._fb.array([]),
      PHONE: this._fb.array([]),
      EMAILID: this._fb.array([]),
      EDATE: '',
      RDATE: '',
      DDATE: '',
      PDATE: '',
      LINE: this._fb.array([]),
      GAMOUNT: '',
      GAMOUNT_DISC_TYPE: '',
      DISC_G_PERCENT: '',
      DISC_GAMOUNT: '',
      TAX_TYPE: '',
      TAX_PERCENT: '',
      TAX_GAMOUNT: '',
      SHIP_TYPE: '',
      SHIP_PERCENT: '',
      SHIP_GAMOUNT: '',
      FINAL_AMOUNT: '',
      PAID_AMOUNT: '',
      BALANCE: ''
    });
  }

  LINES(formName) {
    return this[formName].get('LINE') as FormArray;
  }
  addLINES(formName) {
    this.LINES(formName).push(this._fb.group({
      LINE_NUM: '',
      LINE_NAME: '',
      AMOUNT: ['', [Validators.pattern("^[0-9]*$")]]
    }));
    this.calculateTotal(formName);
  }
  deleteLINES(index, formName) {
    this.LINES(formName).removeAt(index);
    this.calculateTotal(formName);
  }
  ADDRESSES(formName) {
    return this[formName].get('ADDRESS') as FormArray;
  }
  addADDRESSES(formName) {
    this.ADDRESSES(formName).push(this._fb.group({
      ADD_TYPE: '',
      ADD_LINE_1: '',
      ADD_LINE_2: '',
      PIN_CODE: '',
      STATE: '',
      COUNTRY: ''
    }));
    this.calculateTotal(formName);
  }
  deleteADDRESSES(index, formName) {
    this.ADDRESSES(formName).removeAt(index);
    this.calculateTotal(formName);
  }
  PHONES(formName) {
    return this[formName].get('PHONE') as FormArray;
  }
  addPHONES(formName) {
    this.PHONES(formName).push(this._fb.group({
      PHONE_TYPE: '',
      PHONE_NUMBER: '',
    }));
    this.calculateTotal(formName);
  }
  deletePHONES(index, formName) {
    this.PHONES(formName).removeAt(index);
    this.calculateTotal(formName);
  }
  EMAILIDS(formName) {
    return this[formName].get('EMAILID') as FormArray;
  }
  addEMAILS(formName) {
    this.EMAILIDS(formName).push(this._fb.group({
      EMAIL_TYPE: '',
      EMAILID: '',
    }));
    this.calculateTotal(formName);
  }
  deleteEMAILS(index, formName) {
    this.EMAILIDS(formName).removeAt(index);
    this.calculateTotal(formName);
  }
  calculateTotal(formName) {
    this.total_amount = 0;
    for (let i = 0; i <= this[formName].value.LINE.length; i++) {
      if (this[formName].value.LINE[i]) {
        this.total_amount += +this[formName].value.LINE[i].AMOUNT;
      }
    }
    this[formName].controls['GAMOUNT'].setValue(this.total_amount.toFixed(2));
    if (this[formName].controls.GAMOUNT_DISC_TYPE.value == 1 && this[formName].controls.DISC_G_PERCENT.value != '') {
      this[formName].controls['DISC_GAMOUNT'].setValue((this.total_amount * this[formName].controls.DISC_G_PERCENT.value / 100).toFixed(2));
    }
    if (this[formName].controls.TAX_TYPE.value == 1 && this[formName].controls.TAX_PERCENT.value != '') {
      this[formName].controls['TAX_GAMOUNT'].setValue(((this.total_amount - this[formName].controls['DISC_GAMOUNT'].value) * this[formName].controls.TAX_PERCENT.value / 100).toFixed(2));
    }
    if (this[formName].controls.SHIP_TYPE.value == 1 && this[formName].controls.SHIP_PERCENT.value != '') {
      this[formName].controls['SHIP_GAMOUNT'].setValue(((this.total_amount - this[formName].controls['DISC_GAMOUNT'].value) * this[formName].controls.SHIP_PERCENT.value / 100).toFixed(2));
    }
    this[formName].controls['FINAL_AMOUNT'].setValue((this.total_amount - this[formName].controls['DISC_GAMOUNT'].value - this[formName].controls['TAX_GAMOUNT'].value - this[formName].controls['SHIP_GAMOUNT'].value).toFixed(2));
    this[formName].controls['BALANCE'].setValue((this[formName].controls['FINAL_AMOUNT'].value - this[formName].controls['PAID_AMOUNT'].value).toFixed(2));
  }

  toggle(filter?) {
    if (!filter) { filter = "searchMode" }
    else { filter = filter; }
    this.toggleField = filter;
    this.dataLoading = false;
  }

  getData(formData?) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getDocs('EXPENSES', formData).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
      (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
      () => {
        this.dataLoading = false;
      });
  }

  setData(formData) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.setDoc('EXPENSES', formData).then(res => {
      if (res) {
        this.savedChanges = true;
        this.error = false;
        this.errorMessage = "";
        this.dataLoading = false;
      }
    }
    ).catch(err => {
      if (err) {
        this.error = true;
        this.errorMessage = err.message;
        this.dataLoading = false;
      }
    }
    );
  }

  updateData(formData) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.updateDoc('EXPENSES', formData._id, formData).then(res => {
      if (res) {
        this.savedChanges = true;
        this.error = false;
        this.errorMessage = "";
        this.dataLoading = false;
      }
    }
    ).catch(err => {
      if (err) {
        this.error = true;
        this.errorMessage = err.message;
        this.dataLoading = false;
      }
    });
  }
  /**
      getDoc(docId) {
          this.getData("", docId);
      }
   */
  getDoc(docId) {
    this.dataLoading = true;
    this.data$ = this._backendService.getDoc('EXPENSES', docId).subscribe(res => {
      if (res) {
        this.data$ = res;
        this.editDataForm = this._fb.group({
          _id: ['', Validators.required],
          code: ['', Validators.required],
          descr: ['', Validators.required],
          TYPE: ['', Validators.required],
          STATUS: ['', Validators.required],
          INVOICE: [''],
          VENDOR: [''],
          ADDRESS: this._fb.array([]),
          PHONE: this._fb.array([]),
          EMAILID: this._fb.array([]),
          EDATE: '',
          RDATE: '',
          DDATE: '',
          PDATE: '',
          LINE: this._fb.array([]
          ),
          GAMOUNT: '',
          GAMOUNT_DISC_TYPE: '',
          DISC_G_PERCENT: '',
          DISC_GAMOUNT: '',
          TAX_TYPE: '',
          TAX_PERCENT: '',
          TAX_GAMOUNT: '',
          SHIP_TYPE: '',
          SHIP_PERCENT: '',
          SHIP_GAMOUNT: '',
          FINAL_AMOUNT: '',
          PAID_AMOUNT: '',
          BALANCE: ''
        });
        this.editDataForm.patchValue(this.data$);
        for (let i = 0; i < this.data$["ADDRESS"].length; i++) {
          this.ADDRESSES('editDataForm').push(this._fb.group(this.data$["ADDRESS"][i]));
        }
        for (let i = 0; i < this.data$["PHONE"].length; i++) {
          this.PHONES('editDataForm').push(this._fb.group(this.data$["PHONE"][i]));
        }
        for (let i = 0; i < this.data$["EMAILID"].length; i++) {
          this.EMAILIDS('editDataForm').push(this._fb.group(this.data$["EMAILID"][i]));
        }
        for (let i = 0; i < this.data$["LINE"].length; i++) {
          this.LINES('editDataForm').push(this._fb.group(this.data$["LINE"][i]));
        }
        this.calculateTotal(('editDataForm'));
        this.toggle('editMode');
        /**
                  this.editDataForm = this._fb.group({
                      _id: ['', Validators.required],
                      studentdocid: ['', Validators.required],
                      studentcode: ['', Validators.required],
                      studentdescr: ['', Validators.required],
                      studentLAST_NAME: ['', Validators.required],
                      studentfeecd: ['', Validators.required],
                      paiddate: ['', Validators.required],
                      code: ['', Validators.required],
                      descr: ['', Validators.required],
                      line: this._fb.array([]
                      ),
                      gamount: ''
                  });
                  this.editDataForm.patchValue(this.data$);
        
                  for (let i = 0; i < this.data$["line"].length; i++) {
                      this.LINES('editDataForm').push(this._fb.group(this.data$["line"][i]));
                  }
                  this.calculateTotal(('editDataForm'));
                  this.toggle('editMode');
                  */
        this.dataLoading = false;
      }
    },
      (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
      () => {
        this.dataLoading = false;
      });
  }
  deleteDoc(docId) {
    if (confirm("Are you sure want to delete this record ?")) {
      this.dataLoading = true;
      this._backendService.deleteDoc('EXPENSES', docId).then(res => {
        if (res) {
          this.error = false;
          this.errorMessage = "";
          this.dataLoading = false;
        }
      }
      ).catch(err => {
        if (err) {
          this.error = true;
          this.errorMessage = err.message;
          this.dataLoading = false;
        }
      }
      );
    }
  }

  //mat table paginator and filter functions
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnDestroy() {
    // this is not needed when observable is used, in this case, we are registering user on subscription
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}