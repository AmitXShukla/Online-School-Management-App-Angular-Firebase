import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class NavAuthGuardService implements CanActivate {

  constructor (private _router: Router) { }
  async canActivate() {
      if (!window.localStorage.getItem("role")) {
        this._router.navigate(['/settings']);
      }
      return true;
    }
}