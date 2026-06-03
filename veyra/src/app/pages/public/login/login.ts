import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/user/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginData = {
    email: '',
    password: '',
  };

  showPassword = signal(false);
  errorMessage = signal('');

  togglePassword() {
    this.showPassword.update((val) => !val);
  }

  onLogin() {
    this.errorMessage.set('');

    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('userRole', response.user.role);

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error during login', err);
        this.errorMessage.set('Invalid email or password.');
      },
    });
  }
}
