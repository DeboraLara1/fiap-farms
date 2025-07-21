import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    if (this.authService.hasValidSession()) {
      return of(true);
    }

    if (this.authService.isAuthStateInitialized()) {
      return this.authService.user$.pipe(
        take(1),
        map(user => {
          if (user) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        })
      );
    }

    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
