import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { moveIn, fallIn } from '../shared/router.animation';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
// import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BackendService } from '../services/backend.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-fee-view',
  templateUrl: './fee-view.component.html',
  styleUrls: ['./fee-view.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class FeeViewComponent implements OnInit, OnDestroy {

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

  pCDs = ['Paid Amount', 'Discount'];
  freqCDs = ['Bi-Weekly', 'Monthly', 'Yearly', 'One-time', 'OTHER'];
  total_amount = 0;
  addDataForm: FormGroup;
  editDataForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['code', 'descr', 'studentcode', 'studentdescr', 'studentLAST_NAME', '_id'];


  constructor(private _backendService: BackendService, private _fb: FormBuilder, private _router: ActivatedRoute) { }

  ngOnInit() {
    this.toggleField = "resMode";
    //this.toggleField = "searchMode";
    this.error = false;
    this.errorMessage = "";
    this.dataSource = new MatTableDataSource(this.members);
    this.getData();
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
      bsalary: ['', Validators.required],
      line: this._fb.array([]),
      gamount: ''
    });
  }

  LINES(formName) {
     return this[formName].get('line') as FormArray;
  }
  addLINES(formName) {
    this.LINES(formName).push(this._fb.group({
      frequency: ['', Validators.required],
      ptype: ['', Validators.required],
      payval: ['', Validators.required],
      amount: ['', [Validators.pattern("^[0-9]*$")]]
    }));
    this.calculateTotal(formName);
  }
  deleteLINES(index, formName) {
    this.LINES(formName).removeAt(index);
    this.calculateTotal(formName);
  }
  calculateTotal(formName) {
    this.total_amount = 0;
    for (let i = 0; i <= this[formName].value.line.length; i++) {
      if (this[formName].value.line[i]) {
        if (this[formName].value.line[i].ptype == 'Paid Amount') {
          this.total_amount += +this[formName].value.line[i].amount;
        } else {
          this.total_amount -= +this[formName].value.line[i].amount;
        }
      }
    }
    this.total_amount += parseFloat(this[formName].controls['bsalary'].value);
    this[formName].controls['gamount'].setValue(this.total_amount.toFixed(2));
  }

  toggle(filter?) {
    if (!filter) { filter = "searchMode" }
    else { filter = filter; }
    this.toggleField = filter;
    this.dataLoading = false;
  }

  getData(formData?) {
    this.dataLoading = true;
    //this.querySubscription = this._backendService.getDocs('FEE', formData).subscribe((res) => {
      this.querySubscription = this._backendService.getUserStudentFeeDoc().subscribe((res) => {
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


  getDoc(docId) {
    this.dataLoading = true;
    this.data$ = this._backendService.getDoc('FEE', docId).subscribe(res => {
      if (res) {
        this.data$ = res;
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
          bsalary: ['', Validators.required],
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

  //mat table paginator and filter functions
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  // }
  ngOnDestroy() {
    // this is not needed when observable is used, in this case, we are registering user on subscription
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}