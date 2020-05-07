### Please give a STAR * to this repository if you like this project.
<h2>Online School Management App</h2>
<h2><a href="https://www.youtube.com/playlist?list=PLp0TENYyY8lHnfxOOzZ_hTnPF8Hh3eKDo">Video Tutorials!</a></h2>
<h2>This repository is updated to Angular 9.1.4</h2>
<h2>Tools: </h2>
<b>front-end:</b> Angular 9.1.4<br/>
<b>back-end:</b> Google Firestore / Firebase<br/>
Pro Version: AI, Machine Learning Algorithm supported Advance features<br/>
<h3><i>send an email to info@elishconsulting.com for Pro version enquiries.</i></h3>
<h2>Objective</h2>
<ol>
<li>Manage Small, Medium, Large Schools / Colleges online for free</li>
<li>Role based Online App access for Student, Parents, Teacher and School Management</li>
<li>Instant password/role reset for all users</li>
<li>Complete Online School Management App for storing Students Records, Grades, Fee, Attendance, Staff and a lot more.</li>
<li>Live School - Student/Parent Notifications (Marks, Fees, Online Homework posting etc) </li>
<li>Paperless Online App based Education features</li>
<li>Social Authentication</li>
<li>Online and/or Offline (delayed capture) App</li>
<li>One App for multiple platforms (iOS, Android, Desktop, Cloud etc.)</li>
<li>Store and Access millions of records instantly</li>
<li>Paperless and Mobile on-premise/private cloud App deployement</li>
<li>Instant access to ALL historical records at anytime</li>
<li>iOS/Android app (notification enabled) / Advance Custom features (Pro version only)</li>
<li>Unlimited Storage (only limited to server/database hosting)</li>
</ol>

<h2>Let's get started :-</h2>

```ts

// Before we start, Please make sure you have latest version of node js installed.
// head out to https://nodejs.org/en/ and grab latest nodejs.
// Once you have nodejs installed, open command prompt/terminal window.

$ node -v // make sure, this command comes back with a node version
$ npm -v // make sure, this command comes back with a npm version

// How to Install NodeJS on Windows, Mac, Linux & ChromeOS
// First run
$ sudo apt-get update
// and then if needed
$ sudo apt-get install curl gnupg -y
// for nodejs version 14
$ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
$ sudo apt-get install -y nodejs

// Install Angular CLI
$ npm install -g @angular/cli
$ ng -v // make sure, this command comes back with a npm version
$ mkdir app
$ cd app
$ mkdir client
$ cd client
$ ng new SMA
$ cd SMS
$ ng serve

```

<h2> Setup Google Firestore / Firebase Database & Role / Rules</h2>

```ts
service cloud.firestore {
  match /databases/{database}/documents {
// SMS App Rules START
  match /SMS_ROLES/{document} {
   allow read, write: if false;
   }
   match /SMS_USERS/{document} {
	 allow create: if exists(/databases/$(database)/documents/SMS_ROLES/$(request.resource.data.secretKey))
   && get(/databases/$(database)/documents/SMS_ROLES/$(request.resource.data.secretKey)).data.role == request.resource.data.role;
   allow update: if exists(/databases/$(database)/documents/SMS_ROLES/$(request.resource.data.secretKey))
   && get(/databases/$(database)/documents/SMS_ROLES/$(request.resource.data.secretKey)).data.role == request.resource.data.role
   && isDocOwner();
   allow read: if isSignedIn() && isDocOwner();
   }
   match /SMS_CONFIG_ENROLL_CD/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();
   }
   match /SMS_CONFIG_FEE_CD/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();
   }
   match /SMS_CONFIG_MARKS_CD/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();
   }
   match /SMS_STUDENTS/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();
   }
   match /SMS_STUDENTS/{document}/notifications/{doc} {
   allow read: if isSignedIn();
   }
   match /SMS_FEE/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();
   }
   match /SMS_MARKS/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();
   }
   match /SMS_EMPLOYEE/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff();
   }
   match /SMS_SALARY/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff();
   }
   match /SMS_SALARY_CD/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff();
   }
   match /SMS_VOUCHER/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff();
   }
   match /SMS_EXPENSES/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff();
   }
   match /SMS_ASSIGNMENT/{document} {
   allow read, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();
   allow write: if true;
   }
   match /SMS_CLASSES/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();
   }
   match /SMS_HOMEWORK/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();
   }
   match /SMS_TUTORIALS/{document} {
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();
   }
   function isSMSAdmin() {
    return get(/databases/$(database)/documents/SMS_USERS/$(request.auth.uid)).data.role == 'admin';
    }
    function isSMSStaff() {
    return get(/databases/$(database)/documents/SMS_USERS/$(request.auth.uid)).data.role == 'staff';
    }
    function isSMSParent() {
    return get(/databases/$(database)/documents/SMS_USERS/$(request.auth.uid)).data.role == 'parent';
    }
    function isSMSTeacher() {
    return get(/databases/$(database)/documents/SMS_USERS/$(request.auth.uid)).data.role == 'teacher';
    }
    function isSMSStudent() {
    return get(/databases/$(database)/documents/SMS_USERS/$(request.auth.uid)).data.role == 'student';
    }
    function isDocOwner(){
    // assuming document has a field author which is uid
    // Only the authenticated user who authored the document can read or write
    	return request.auth.uid == resource.data.author;
      // This above read query will fail
    // The query fails even if the current user actually is the author of every story document.
    //  The reason for this behavior is that when Cloud Firestore applies your security rules, 
    //  it evaluates the query against its potential result set,
    //   not against the actual properties of documents in your database. 
    //   If a query could potentially include documents that violate your security rules, 
    //   the query will fail.
    //   on your client app, make sure to include following
    //   .where("author", "==", this.afAuth.auth.currentUser.uid)
    }
    function isSignedIn() {
    // check if user is signed in
          return request.auth.uid != null;
    }
  // SMS App Rules END
}
}
```