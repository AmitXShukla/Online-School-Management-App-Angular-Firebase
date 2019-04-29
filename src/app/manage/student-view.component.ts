import { Component, OnInit, OnDestroy } from '@angular/core';
import { moveIn, fallIn } from '../shared/router.animation';
import { Observable } from 'rxjs';
import { BackendService } from '../services/backend.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class StudentViewComponent implements OnInit, OnDestroy {
  data;
  state: string = '';
  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;
  private querySubscription;

  // file upload
  docId: string;
  fileName: string;
  showFileUpload: boolean = false;
  showDocument: boolean = false;
  docUrl: Observable<string | null>;

  constructor(private _backendService: BackendService) { }

  ngOnInit() {
    this.getDoc();
  }

  getDoc() {
    this.dataLoading = true;
    //this.data$ = this._backendService.getDoc('STUDENT', docId);
    this.dataLoading = false;
    this.querySubscription = this._backendService.getUserStudentDoc()
    .subscribe(res => {
      if (res.length > 0) {
        this.data = res[0];
        this.docId = res[0]["_id"]; // this is required to pass at file upload directive
      } else {
        this.error = true;
        this.errorMessage = "Your passcode didn't match with our records. Please check your passcode with your Education provider. Please go to SETTINGS page to update your passcode.";
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
  getDocUrl(docUrl) {
    this.fileName = docUrl;
    this.docUrl = this._backendService.getFileDownloadUrl(docUrl);
  }
  ngOnDestroy() {
    // this is not needed when observable is used, in this case, we are registering user on subscription
    if (this.querySubscription) {
        this.querySubscription.unsubscribe();
    }
}
}