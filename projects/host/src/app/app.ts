import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { Subscription } from 'rxjs';
import { AppInitializerComponent } from './components/app-initializer/app-initializer';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, AppInitializerComponent],
})
export class App implements OnInit, OnDestroy {
  userEmail = '';
  isLoggedIn = false;
  authInitialized = false;
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.user$.subscribe(user => {
      this.userEmail = user?.email || '';
      this.isLoggedIn = !!user;
      this.authInitialized = true;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
  }
}
