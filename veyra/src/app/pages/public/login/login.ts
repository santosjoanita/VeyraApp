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

    const payload = {
      email: this.loginData.usernameOrEmail,
      password: this.loginData.password,
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        console.log('api reaction', response);

        const token = response?.accessToken || response?.token;

        const role = response?.user?.role || response?.role || 'worker';

        if (token) {
          localStorage.setItem('accessToken', token);
          localStorage.setItem('userRole', role);
          localStorage.setItem('userName', response.user?.name || response.name || 'Username');

          localStorage.setItem('userId', response.user?.id || response.id || '');

          console.log('token kept in localStorage:', token);
          console.log('userRole kept in localStorage:', role);
          console.log('userId kept in localStorage:', localStorage.getItem('userId'));

          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Error with login:', err);
        this.errorMessage.set('E-mail or password incorrect. Please try again.');
      },
    });
  }
}
