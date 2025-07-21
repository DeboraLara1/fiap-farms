import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  email = '';
  password = '';
  error = '';
  loading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  async onSubmit() {
    this.loading = true;
    this.error = '';
    try {
      await this.authService.register(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e) {
      this.error = 'Erro ao cadastrar. Tente outro e-mail.';
    } finally {
      this.loading = false;
    }
  }
}
