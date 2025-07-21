import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
