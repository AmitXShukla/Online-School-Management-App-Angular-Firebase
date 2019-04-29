import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutusComponent } from './shared/aboutus.component';
import { SettingsComponent } from './shared/settings/settings.component';
import { LoginComponent } from './shared/login/login.component';
import { SignupComponent } from './shared/login/signup.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NavAuthGuardService } from './services/nav-auth-guard.service';
import { StudentComponent } from './manage/student.component';
import { StudentViewComponent } from './manage/student-view.component';
import { FeeComponent } from './manage/fee.component';
import { FeeViewComponent } from './manage/fee-view.component';
import { MarksComponent } from './manage/marks.component';
import { MarksViewComponent } from './manage/marks-view.component';
import { FeecodeComponent } from './setup/feecode.component';
import { MarkscodeComponent } from './setup/markscode.component';
import { EnrollmentComponent } from './setup/enrollment.component';
import { EmployeeComponent } from './staff/employee.component';
import { VoucherComponent } from './staff/voucher.component';
import { ExpensesComponent } from './staff/expenses.component';
import { SalaryComponent } from './staff/salary.component';
import { SalaryCodeComponent } from './staff/salarycode.component';
import { AssignmentsComponent } from './online/assignments.component';
import { AssignmentsViewComponent } from './online/assignments-view.component';
import { HomeworkComponent } from './online/homework.component';
import { HomeworkViewComponent } from './online/homework-view.component';
import { TutorialsComponent } from './online/tutorials.component';
import { TutorialsViewComponent } from './online/tutorials-view.component';
import { ClassesComponent } from './online/classes.component';
import { ClassesViewComponent } from './online/classes-view.component';
import { NotificationsComponent } from './shared/settings/notifications.component';

const routes: Routes = [
  { path: '', redirectTo: '/aboutus', pathMatch: 'full' },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'student', component: StudentComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'student-view', component: StudentViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'enrollment', component: EnrollmentComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'feecode', component: FeecodeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'fee', component: FeeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'fee-view', component: FeeViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'fee/:id', component: FeeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'marks', component: MarksComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'marks-view', component: MarksViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'marks/:id', component: MarksComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'markscode', component: MarkscodeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'voucher', component: VoucherComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'assignments', component: AssignmentsComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'assignments-view', component: AssignmentsViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'homework', component: HomeworkComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'homework-view', component: HomeworkViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'tutorials', component: TutorialsComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'tutorials-view', component: TutorialsViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'classes', component: ClassesComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'classes-view', component: ClassesViewComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'salarycode', component: SalaryCodeComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'salary/:id', component: SalaryComponent, canActivate: [AuthGuardService, NavAuthGuardService] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/aboutus', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
