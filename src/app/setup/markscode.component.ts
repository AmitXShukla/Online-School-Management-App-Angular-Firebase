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
  selector: 'app-markscode',
  templateUrl: './markscode.component.html',
  styleUrls: ['./markscode.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class MarkscodeComponent implements OnInit, OnDestroy {

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
            line: this._fb.array([this._fb.group({
                subject: ['', Validators.required],
                minmarks: ['', Validators.required],
                maxmarks: ['', Validators.required],
                marks: ['', [Validators.pattern("^[0-9]*$")]]
            })]),
            gamount: ''
        });
        this.editDataForm = this._fb.group({
            _id: ['', Validators.required],
            code: ['', Validators.required],
            descr: ['', Validators.required],
            line: this._fb.array([]),
            gamount: ''
        });
    }

    LINES(formName) {
        return this[formName].get('line') as FormArray;
    }
    addLINES(formName) {
        this.LINES(formName).push(this._fb.group({
            subject: ['', Validators.required],
                minmarks: ['', Validators.required],
                maxmarks: ['', Validators.required],
                marks: ['', [Validators.pattern("^[0-9]*$")]]
        }));
        this.calculateTotal(formName);
    }
    deleteLINES(index,formName) {
        this.LINES(formName).removeAt(index);
        this.calculateTotal(formName);
    }
    calculateTotal(formName) {
        this.total_amount = 0;
        for (let i = 0; i <= this[formName].value.line.length; i++) {
            if (this[formName].value.line[i]) {
                    this.total_amount += +this[formName].value.line[i].marks;
            }
        }
        this[formName].controls['gamount'].setValue(this.total_amount.toFixed(0));
    }

    toggle(filter?) {
        if (!filter) { filter = "searchMode" }
        else { filter = filter; }
        this.toggleField = filter;
        this.dataLoading = false;
    }

    getData(formData?) {
        this.dataLoading = true;
        this.querySubscription = this._backendService.getDocs('MARKS_CD',formData).subscribe((res) => {
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
        this.querySubscription = this._backendService.setDoc('MARKS_CD',formData).then(res => {
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
        this.querySubscription = this._backendService.updateDoc('MARKS_CD',formData._id,formData).then(res => {
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
        this.data$ = this._backendService.getDoc('MARKS_CD',docId).subscribe(res => {
            if(res) {
                this.data$ = res;
                            this.editDataForm = this._fb.group({
                                _id: ['', Validators.required],
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
                            this.dataLoading = false;
            }},
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
                this._backendService.deleteDoc('MARKS_CD',docId).then(res => {
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
    //     filterValue = filterValue.trim(); // Remove whitespace
    //     filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    //     this.dataSource.filter = filterValue;
    // }
    ngOnDestroy() {
        // this is not needed when observable is used, in this case, we are registering user on subscription
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
        }
    }
}