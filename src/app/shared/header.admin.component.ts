import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header.admin.component.html',
  styleUrls: ['./header.admin.component.css']
})
export class HeaderAdminComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() pageTitle: string;
  @Input() helpType: string;
  emailSent = false;
  selectedValue: any;
  formShowing = false;
  configData: any;
  userRole = 'student';
  msgCount$: Observable<any>;

  error: any;
  dataLoading: boolean = false;
  brokenNetwork = false;

  constructor(private _backendService: BackendService) {
  }

  ngOnInit() {
    this.configData = this._backendService.getConfig();
    if(window.localStorage.getItem("role")) {
      this.userRole = window.localStorage.getItem("role");
      this.getMsgCounts();
    }
  }

  getMsgCounts(){
    this.msgCount$ = this._backendService.getUserStudentMSGCounts();
  }
  onSubmit(formData: any) {
    this.dataLoading = true;
    //console.log(formData);
    this._backendService.sendEmail(formData).subscribe(
      res => {
        //console.log(res);
      },
      error => {
        //console.log(error);
        console.log("API didn't respond.");
        this.brokenNetwork = true;
        this.dataLoading = false;
      },
      () => {
        this.dataLoading = false;
        this.emailSent = true;
      }
    )
  }
}
