import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    password: ''
  };

  constructor(private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (!this.loginData.usernameOrEmail || !this.loginData.password) {
      alert('Preenche todos os campos!');
      return;
    }

    const usersStr = localStorage.getItem('veyra_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    const validUser = users.find((u: any) => 
      (u.email === this.loginData.usernameOrEmail || u.username === this.loginData.usernameOrEmail) &&
      u.password === this.loginData.password
    );

    if (validUser) {
      localStorage.setItem('veyra_current_user', JSON.stringify(validUser));
      this.router.navigate(['/dashboard']);
    } else {
      alert('Credenciais incorretas. Tenta de novo ou regista uma conta.');
    }
  }
}