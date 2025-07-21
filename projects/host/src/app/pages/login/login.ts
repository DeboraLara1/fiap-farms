import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  email = localStorage.getItem('rememberedEmail') || '';
  password = '';
  error = '';
  loading = false;
  rememberMe = !!localStorage.getItem('rememberedEmail');
  resetSent = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async onSubmit() {
    this.loading = true;
    this.error = '';

    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', this.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e) {
      this.error = 'Usuário ou senha inválidos.';
    } finally {
      this.loading = false;
    }
  }

  async onResetPassword() {
    this.error = '';
    this.resetSent = false;
    try {
      await this.authService.resetPassword(this.email);
      this.resetSent = true;
    } catch (e) {
      this.error = 'Erro ao enviar e-mail de redefinição.';
    }
  }
}
