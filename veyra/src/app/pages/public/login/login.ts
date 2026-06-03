import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/user/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal('');
  showPassword = false;

  loginData = {
    usernameOrEmail: '',
    password: '',
  };

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.errorMessage.set('');

    if (!this.loginData.usernameOrEmail || !this.loginData.password) {
      this.errorMessage.set('Por favor, preencha todos os campos.');
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response && response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('userRole', response.user?.role || response.role || 'worker');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Erro ao fazer login:', err);
        this.errorMessage.set('E-mail/Utilizador ou palavra-passe incorretos.');
      },
    });
  }
}
