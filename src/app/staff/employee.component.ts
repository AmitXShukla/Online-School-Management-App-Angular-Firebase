import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { moveIn, fallIn } from '../shared/router.animation';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
// import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BackendService } from '../services/backend.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class EmployeeComponent implements OnInit, OnDestroy {

  members: any[];
  dataSource: MatTableDataSource<any>;
  myDocData;
  data$: Observable<any>;
  toggleField: string;
  state: string = '';
  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;
  private querySubscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['code', 'descr', '_id'];
  salCDs$;

  constructor(private _backendService: BackendService) { }

  ngOnInit() {
    this.toggleField = "searchMode";
    this.dataSource = new MatTableDataSource(this.members);
    this.getSalData();
  }

  toggle(filter?) {
    if (!filter) { filter = "searchMode" }
    else { filter = filter; }
    this.toggleField = filter;
    this.dataLoading = false;
  }

  getSalData() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getDocs('SALARY_CD').subscribe((res) => {
      this.salCDs$ = res;
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

  getData(formData?) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getDocs('EMPLOYEE', formData).subscribe((res) => {
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
    this.querySubscription = this._backendService.setDoc('EMPLOYEE', formData).then(res => {
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
    this.querySubscription = this._backendService.updateDoc('EMPLOYEE', formData._id, formData).then(res => {
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

  getDoc(docId) {
    this.dataLoading = true;
    this.data$ = this._backendService.getDoc('EMPLOYEE', docId);
    this.toggle('editMode');
    this.dataLoading = false;
    // this.dataLoading = true;
    // this.data$ = this._backendService.getDoc('EMPLOYEE', docId).subscribe(res => {
    //   if (res) {
    //     this.data$ = res;
    //     this.toggle('editMode');
    //     this.dataLoading = false;
    //   }
    // },
    //   (error) => {
    //     this.error = true;
    //     this.errorMessage = error.message;
    //     this.dataLoading = false;
    //   },
    //   () => {
    //     this.dataLoading = false;
    //   });
  }

  deleteDoc(docId) {
    if (confirm("Are you sure want to delete this record ?")) {
      this.dataLoading = true;
      this._backendService.deleteDoc('EMPLOYEE', docId).then(res => {
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