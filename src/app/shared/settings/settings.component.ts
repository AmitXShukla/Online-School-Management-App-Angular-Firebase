import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  state: string = '';
  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;
  data$: Observable<any>;
  private querySubscription;
  roles: any[] = [
    { value: 'student', viewValue: 'Student' },
    { value: 'parent', viewValue: 'Parent' },
    { value: 'staff', viewValue: 'Staff' },
    { value: 'admin', viewValue: 'Admin' },
    { value: 'teacher', viewValue: 'Teacher' }
  ];

  constructor(private _backendService: BackendService, private _router: Router) {
  }

  ngOnInit() {
      this.getUserDoc();
  }

  logout() {
    this._backendService.logout()
      .then(
        (success) => {
          this._router.navigate(['/login']);
        }).catch(function (error) {
          console.log(error);
        })
  }

  getUserDoc() {
    this.dataLoading = true;
    this.data$ = this._backendService.getUserDoc();
    this.dataLoading = false;
  }

  onSubmit(formData) {
    this.dataLoading = true;
    this._backendService.updateUser(formData).then(res => {
      if (res) {
        this.savedChanges = true;
        this.error = false;
        this.errorMessage = "";
        this.dataLoading = false;
        window.localStorage.setItem("role", formData.role);
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

  routeLoginPage() {
    this.error = false;
    this.errorMessage = "";
    this.savedChanges = false;
  }
}