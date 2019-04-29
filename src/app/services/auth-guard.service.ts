import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

  constructor (private _backendService: BackendService, private _router: Router) { }
  async canActivate(): Promise<boolean> {
      const authenticatedUser = await this._backendService.getUser();
      const authenticated = !!authenticatedUser;
      if (!authenticated) {
        this._router.navigate(['/login']);
      }
      return authenticated;
    }
}