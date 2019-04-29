import { Component, OnInit } from '@angular/core';
import { moveIn, fallIn } from '../../shared/router.animation';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn]': '' }
})
export class NotificationsComponent implements OnInit {
  data;
  data$;
  toggle: boolean = false;
  state: string = '';
  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;

  constructor(private _backendService: BackendService) { }

  ngOnInit() {
    this.getDoc();
  }

  getDoc() {
    this.dataLoading = true;
    this.data$ = this._backendService.getUserStudentMSGDoc();
    this.dataLoading = false;
  }
  updateReceipt(messageId){
    //console.log(messageId);
  }
}