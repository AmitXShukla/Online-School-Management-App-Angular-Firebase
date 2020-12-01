import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
// import { auth } from 'firebase/app';
import auth from 'firebase';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
// import { firestore } from 'firebase/app';
import * as firebase from 'firebase/app';
import firestore from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  authState: any = null;

  constructor(public afAuth: AngularFireAuth, private _afs: AngularFirestore, private _http: HttpClient, private _storage: AngularFireStorage) { 
    this.afAuth.authState.subscribe(authState => {
      this.authState = authState;
    })
  }

  getConfig() {
    return environment.social;
  }

  // function to send emails using a PHP API //
  sendEmail(messageData: any) {
    let httpOptions_e = {
      headers: new HttpHeaders({ 'Content-Type': 'application/X-www-form-urlencoded' })
    };
    return this._http.post(environment.emailAPI, messageData, httpOptions_e);
  }

  // login page funcitons - login with FB/GOOGLE/EMAIL, if formData is passed, this means is user is using email/password login
  login(loginType: any, formData?: any) {
    if (formData) {
      return this.afAuth.signInWithEmailAndPassword(formData.email, formData.password);
    } else {
      let loginMethod;
      if (loginType === 'FB') { loginMethod = new auth.auth.FacebookAuthProvider(); }
      if (loginType === 'GOOGLE') { loginMethod = new auth.auth.GoogleAuthProvider(); }

      return this.afAuth.signInWithRedirect(loginMethod);
    }
  }
  logout() {
    window.localStorage.removeItem("uid");
    window.localStorage.removeItem("displayName");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("picture");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("role");
    return this.afAuth.signOut();
  }

  // method to retreive firebase auth after login redirect
  redirectLogin() {
    return this.afAuth.getRedirectResult();
  }
  createUser(formData: any) {
    if (environment.database === 'firebase') {
      return this.afAuth.createUserWithEmailAndPassword(formData.value.email, formData.value.password);
    }
    if (environment.database === 'SQL') {
      // need to call SQL API here if a SQL Database is used
    }
  }
  getUser(): Promise<any> {
    return this.afAuth.authState.pipe(take(1)).toPromise();
  }

  // setting page functions
  updateUser(formData: any): Promise<any> {
    // return this.setDoc('USERS', formData, this.afAuth.currentUser.uid);
    return this.setDoc('USERS', formData, this.authState.uid);
  }
  getUserDoc() {
    // return this.getDoc('USERS', this.afAuth.auth.currentUser.uid);
    return this.getDoc('USERS', this.authState.uid);
  }
  getUserStudentDoc() {
    // return this.getDoc('USERS', this.afAuth.auth.currentUser.uid)
    return this.getDoc('USERS', this.authState.uid)
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls('STUDENT'), ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
  ));
  }
  getUserStudentMSGDoc() {
    // return this.getDoc('USERS', this.afAuth.auth.currentUser.uid)
    return this.getDoc('USERS', this.authState.uid)
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls('STUDENT'), ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls('STUDENT')+'/'+res[0]['_id']+'/notifications').valueChanges()))));
   //.pipe(switchMap(res => this._afs.collection(this.getCollUrls('STUDENT')/res[0]['_id']/notifications, ref => ref.where('studentdocid', '==', res[0]['_id'])).valueChanges()))));
  }
  getUserStudentMSGCounts() {
    if(this.afAuth.currentUser != null) {
    // return this.getDoc('USERS', this.afAuth.auth.currentUser.uid)
    return this.getDoc('USERS', this.authState.uid)
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls('STUDENT'), ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls('STUDENT')+'/'+res[0]['_id']+'/notifications', ref => ref.where('readReceipt', '==', true)).valueChanges()))));
   //.pipe(switchMap(res => this._afs.collection(this.getCollUrls('STUDENT')/res[0]['_id']/notifications, ref => ref.where('studentdocid', '==', res[0]['_id'])).valueChanges()))));
    } else return null;
  }
  getUserStudentFeeDoc() {
    // return this.getDoc('USERS', this.afAuth.auth.currentUser.uid)
    return this.getDoc('USERS', this.authState.uid)
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls('STUDENT'), ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls('FEE'), ref => ref.where('studentdocid', '==', res[0]['_id'])).valueChanges()))));
  }
  getUserStudentMarksDoc() {
    // return this.getDoc('USERS', this.afAuth.auth.currentUser.uid)
    return this.getDoc('USERS', this.authState.uid)
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls('STUDENT'), ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls('MARKS'), ref => ref.where('studentdocid', '==', res[0]['_id'])).valueChanges()))));
  }
  getUserStudentTutsDoc(_url) {
    // return this.getDoc('USERS', this.afAuth.auth.currentUser.uid)
    return this.getDoc('USERS', this.authState.uid)
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls('STUDENT'), ref => ref.where('SKEY', '==', res['phone'])).valueChanges()
   .pipe(switchMap(res => this._afs.collection(this.getCollUrls(_url), ref => ref.where('ENROLLMENT_CODE', '==', res[0]['ENROLLMENT_CODE'])).valueChanges()))));
  }

  // generic collection url pages and generic CRUD functions
  get timestamp() {
    const d = new Date();
    return d;
    // return firebase.firestore.FieldValue.serverTimestamp();
  }
  getCollUrls(coll: any) {
    let _coll = "SMS_USERS";
    if (coll == "USERS") { _coll = "SMS_USERS"; }
    if (coll == "ENROLL_CD") { _coll = "SMS_CONFIG_ENROLL_CD"; }
    if (coll == "FEE_CD") { _coll = "SMS_CONFIG_FEE_CD"; }
    if (coll == "MARKS_CD") { _coll = "SMS_CONFIG_MARKS_CD"; }
    if (coll == "STUDENT") { _coll = "SMS_STUDENTS"; }
    if (coll == "FEE") { _coll = "SMS_FEE"; }
    if (coll == "MARKS") { _coll = "SMS_MARKS"; }
    if (coll == "EMPLOYEE") { _coll = "SMS_EMPLOYEE"; }
    if (coll == "SALARY_CD") { _coll = "SMS_SALARY_CD"; }
    if (coll == "SALARY") { _coll = "SMS_SALARY"; }
    if (coll == "VOUCHER") { _coll = "SMS_VOUCHER"; }
    if (coll == "EXPENSES") { _coll = "SMS_EXPENSES"; }
    if (coll == "ASSIGNMENT") { _coll = "SMS_ASSIGNMENT"; }
    if (coll == "CLASSES") { _coll = "SMS_CLASSES"; }
    if (coll == "HOMEWORK") { _coll = "SMS_HOMEWORK"; }
    if (coll == "TUTORIALS") { _coll = "SMS_TUTORIALS"; }
    return _coll;
  }
  setDoc(coll: string, data: any, docId?: any) {
    const id = this._afs.createId();
    const item = { id, name };
    if (docId) { item.id = docId; }
    const timestamp = this.timestamp
    var docRef = this._afs.collection(this.getCollUrls(coll)).doc(item.id);
    return docRef.set({
      ...data,
      _id: id,
      updatedAt: timestamp,
      createdAt: timestamp,
      // username: this.afAuth.auth.currentUser.displayName,
      // useremail: this.afAuth.auth.currentUser.email,
      // author: this.afAuth.auth.currentUser.uid
      // username: this.authState.currentUser.displayName,
      username: this.authState.displayName,
      useremail: this.authState.email,
      author: this.authState.uid
    }).then((res) => { return true });
  }
  updateDoc(coll: string, docId: string, data: any) {
    const timestamp = this.timestamp
    var docRef = this._afs.collection(this.getCollUrls(coll)).doc(docId);
    return docRef.update({
      ...data,
      updatedAt: timestamp,
      // username: this.afAuth.auth.currentUser.displayName,
      // useremail: this.afAuth.auth.currentUser.email,
      // author: this.afAuth.auth.currentUser.uid
      username: this.authState.displayName,
      useremail: this.authState.email,
      author: this.authState.uid
    }).then((res) => { return true });
  }
  updateFileUpload(coll: string, docId: string, filePath) {
    const timestamp = this.timestamp;
    const docRef = this._afs.collection(this.getCollUrls(coll)).doc(docId);
    return docRef.update({
      files: firestore.firestore.FieldValue.arrayUnion(filePath),
      updatedAt: timestamp,
      // username: this.afAuth.auth.currentUser.displayName,
      // useremail: this.afAuth.auth.currentUser.email,
      // author: this.afAuth.auth.currentUser.uid
      username: this.authState.displayName,
      useremail: this.authState.email,
      author: this.authState.uid
    });
  }
  getFileDownloadUrl(url: any) {
    const ref = this._storage.ref(url);
    return ref.getDownloadURL();
  }
  deleteDoc(coll: string, docId: string) {
    const timestamp = this.timestamp
    var docRef = this._afs.collection(this.getCollUrls(coll)).doc(docId);
    return docRef.delete().then((res) => { return true });
  }
  getDoc(coll: string, docId: string) {
    return this._afs.collection(this.getCollUrls(coll)).doc(docId).valueChanges();
  }
  getDocs(coll: string, formData?: any) {
    if (formData) {
      if (formData.code) {
        return this._afs.collection(this.getCollUrls(coll), ref => ref.where('code', '>=', formData.code)).valueChanges();
      } else {
        return this._afs.collection(this.getCollUrls(coll), ref => ref.where('descr', '>=', formData.descr)).valueChanges();
      }
    } else { // no search critera - fetch all docs
      return this._afs.collection(this.getCollUrls(coll)).valueChanges();
    }
  }
}
