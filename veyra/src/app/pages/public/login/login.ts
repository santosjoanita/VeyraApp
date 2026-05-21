import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPassword = signal<boolean>(false);
  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }
}