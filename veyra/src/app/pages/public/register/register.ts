import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/user/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  credentials = {
    name: '',
    email: '',
    password: '',
  };

  showPassword = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  handleRegister() {
    this.errorMessage = '';

    if (!this.credentials.name || !this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor, preenche todos os campos.';
      return;
    }

    this.authService.register(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no registo', err);
        this.errorMessage = 'Não foi possível efetuar o registo. Tenta novamente.';
      },
    });
  }
}
