import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-helpdesk',
  templateUrl: './helpdesk.component.html',
  styleUrls: ['./helpdesk.component.css']
})
export class HelpdeskComponent implements OnInit {
  showHelp = false;
  @Input() helpType: string;
  
  constructor() { }

  ngOnInit() {
  }

}
