import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElishCustomMaterialModule } from './shared/custom.material';
import { FooterComponent } from './shared/footer.component';
import { HelpdeskComponent } from './shared/helpdesk.component';
import { LoginComponent } from './shared/login/login.component';
import { SignupComponent } from './shared/login/signup.component';
import { SettingsComponent } from './shared/settings/settings.component';
import { AboutusComponent } from './shared/aboutus.component';
import { FeecodeComponent } from './setup/feecode.component';
import { MarkscodeComponent } from './setup/markscode.component';
import { EnrollmentComponent } from './setup/enrollment.component';
import { StudentComponent } from './manage/student.component';
import { FeeComponent } from './manage/fee.component';
import { MarksComponent } from './manage/marks.component';
// Angular Firebase settings
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AttendanceComponent } from './manage/attendance.component';
import { HeaderAdminComponent } from './shared/header.admin.component';
import { EmployeeComponent } from './staff/employee.component';
import { SalaryCodeComponent } from './staff/salarycode.component';
import { VoucherComponent } from './staff/voucher.component';
import { ExpensesComponent } from './staff/expenses.component';
import { SalaryComponent } from './staff/salary.component';
import { HomeworkComponent } from './online/homework.component';
import { TutorialsComponent } from './online/tutorials.component';
import { ClassesComponent } from './online/classes.component';
import { AssignmentsComponent } from './online/assignments.component';
// file upload
import { FileUploadComponent } from './shared/dropzone/fileupload.component';
import { DropZoneDirective } from './shared/dropzone/dropzone.directive';
import { FileSizePipe } from './shared/dropzone/filesize.pipe';
import { AssignmentsViewComponent } from './online/assignments-view.component';
import { ClassesViewComponent } from './online/classes-view.component';
import { HomeworkViewComponent } from './online/homework-view.component';
import { TutorialsViewComponent } from './online/tutorials-view.component';
import { StudentViewComponent } from './manage/student-view.component';
import { FeeViewComponent } from './manage/fee-view.component';
import { MarksViewComponent } from './manage/marks-view.component';
import { NotificationsComponent } from './shared/settings/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HelpdeskComponent,
    LoginComponent,
    SignupComponent,
    SettingsComponent,
    AboutusComponent,
    FeecodeComponent,
    MarkscodeComponent,
    StudentComponent,
    EnrollmentComponent,
    FeeComponent,
    MarksComponent,
    AttendanceComponent,
    HeaderAdminComponent,
    EmployeeComponent,
    SalaryCodeComponent,
    VoucherComponent,
    ExpensesComponent,
    SalaryComponent,
    HomeworkComponent,
    TutorialsComponent,
    ClassesComponent,
    AssignmentsComponent,
    FileUploadComponent,
    DropZoneDirective,
FileSizePipe,
AssignmentsViewComponent,
ClassesViewComponent,
HomeworkViewComponent,
TutorialsViewComponent,
StudentViewComponent,
FeeViewComponent,
MarksViewComponent,
NotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ElishCustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'SMS-APP'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
