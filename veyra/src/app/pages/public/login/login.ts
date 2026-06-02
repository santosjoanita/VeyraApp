import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/user/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPassword = false;

  loginData = {
    usernameOrEmail: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (!this.loginData.usernameOrEmail || !this.loginData.password) {
      alert('Preenche todos os campos!');
      return;
    }

    const success = this.authService.login(this.loginData.usernameOrEmail, this.loginData.password);

    if (success) {
      const redirectUrl = this.authService.popRedirectUrl();
      this.router.navigateByUrl(redirectUrl ?? '/dashboard');
    } else {
      alert('Credenciais incorretas. Tenta de novo ou regista uma conta.');
    }
  }
}
