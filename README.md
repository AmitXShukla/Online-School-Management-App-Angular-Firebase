# Please give a Star * to this repository if you like this project.
<h2>Online School Management App</h2>
<h2><a href="https://www.youtube.com/playlist?list=PLp0TENYyY8lHnfxOOzZ_hTnPF8Hh3eKDo">Video Tutorials!</a></h2>
<h2>This repository is updated to Angular 9.0</h2>
<h2>Tools: </h2>
<b>front-end:</b> Angular 9.0.0<br/>
<b>back-end:</b> Google Firestore / Firebase<br/>
Pro Version: AI, Machine Learning Algorithm supported Advance features<br/>
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
<i>send an email to info@elishconsulting.com for Pro version enquiries.</i>

<h2>Let's get started :-</h2>
<br/><br/>
Before we start, Please make sure you have latest version of node js installed.<br/>
Let's head out to https://nodejs.org/en/ and grab latest nodejs.<br/>
Once you have nodejs installed, open command prompt/terminal window.<br/>
$ node -v // make sure, this command comes back with a node version<br/>
$ npm -v // make sure, this command comes back with a npm version<br/><br/>

<h2>How to Install NodeJS on Windows, Mac, Linux & ChromeOS</h2>
# First run<br/>
$ sudo apt-get update<br/>
# and then if needed<br/>
$ sudo apt-get install curl gnupg -y<br/>
# or nodejs version 11<br/>
$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -<br/>
$ sudo apt-get install -y nodejs<br/><br/>
<h2>Install Angular CLI</h2>
$ npm install -g @angular/cli<br/>
$ ng -v // make sure, this command comes back with a npm version<br/><br/>
$ mkdir app<br/>
$ cd app<br/>
$ mkdir client<br/
$ cd client<br/>
$ ng new SMA<br/>
$ cd SMS<br/>
$ ng serve<br/>
<br/><br/>

<h2> Setup Google Firestore / Firebase Database & Role / Rules</h2>
// SMS App Rules START<br/>
  match /SMS_ROLES/{document} {<br/>
   allow read, write: if false;<br/>
   }<br/>
   match /SMS_USERS/{document} {<br/>
	 allow create: if exists(/databases/$(database)/documents/SMS_ROLES/$(request.resource.data.secretKey))<br/>
   && get(/databases/$(database)/documents/SMS_ROLES/$(request.resource.data.secretKey)).data.role == request.resource.data.role;<br/>
   allow update: if exists(/databases/$(database)/documents/SMS_ROLES/$(request.resource.data.secretKey))<br/>
   && get(/databases/$(database)/documents/SMS_ROLES/$(request.resource.data.secretKey)).data.role == request.resource.data.role<br/>
   && isDocOwner();<br/>
   allow read: if isSignedIn() && isDocOwner();<br/>
   }<br/>
   match /SMS_CONFIG_ENROLL_CD/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();<br/>
   }<br/>
   match /SMS_CONFIG_FEE_CD/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();<br/>
   }<br/>
   match /SMS_CONFIG_MARKS_CD/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();<br/>
   }<br/>
   match /SMS_STUDENTS/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();<br/>
   }<br/>
   match /SMS_STUDENTS/{document}/notifications/{doc} {<br/>
   allow read: if isSignedIn();<br/>
   }<br/>
   match /SMS_FEE/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();<br/>
   }<br/>
   match /SMS_MARKS/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();<br/>
   }<br/>
   match /SMS_EMPLOYEE/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff();<br/>
   }<br/>
   match /SMS_SALARY/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff();<br/>
   }<br/>
   match /SMS_SALARY_CD/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff();<br/>
   }<br/>
   match /SMS_VOUCHER/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff();<br/>
   }<br/>
   match /SMS_EXPENSES/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff();<br/>
   }<br/>
   match /SMS_ASSIGNMENT/{document} {<br/>
   allow read, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();<br/>
   allow write: if true;<br/>
   }<br/>
   match /SMS_CLASSES/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();<br/>
   }<br/>
   match /SMS_HOMEWORK/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();<br/>
   }<br/>
   match /SMS_TUTORIALS/{document} {<br/>
   allow read, write, delete: if isSMSAdmin() || isSMSStaff() || isSMSTeacher();<br/>
   }<br/>
   function isSMSAdmin() {<br/>
    return get(/databases/$(database)/documents/SMS_USERS/$(request.auth.uid)).data.role == 'admin';<br/>
    }<br/>
    function isSMSStaff() {<br/>
    return get(/databases/$(database)/documents/SMS_USERS/$(request.auth.uid)).data.role == 'staff';<br/>
    }<br/>
    function isSMSParent() {<br/>
    return get(/databases/$(database)/documents/SMS_USERS/$(request.auth.uid)).data.role == 'parent';<br/>
    }<br/>
    function isSMSTeacher() {<br/>
    return get(/databases/$(database)/documents/SMS_USERS/$(request.auth.uid)).data.role == 'teacher';<br/>
    }<br/>
    function isSMSStudent() {<br/>
    return get(/databases/$(database)/documents/SMS_USERS/$(request.auth.uid)).data.role == 'student';<br/>
    }<br/>
    function isDocOwner(){<br/>
    // assuming document has a field author which is uid<br/>
    // Only the authenticated user who authored the document can read or write<br/>
    	return request.auth.uid == resource.data.author;<br/>
      // This above read query will fail<br/>
    // The query fails even if the current user actually is the author of every story document.<br/>
    //  The reason for this behavior is that when Cloud Firestore applies your security rules, <br/>
    //  it evaluates the query against its potential result set,<br/>
    //   not against the actual properties of documents in your database. <br/>
    //   If a query could potentially include documents that violate your security rules, <br/>
    //   the query will fail.<br/>
    //   on your client app, make sure to include following<br/>
    //   .where("author", "==", this.afAuth.auth.currentUser.uid)<br/>
    }<br/>
    function isSignedIn() {<br/>
    // check if user is signed in<br/>
          return request.auth.uid != null;<br/>
    }<br/>
  // SMS App Rules END<br/>
