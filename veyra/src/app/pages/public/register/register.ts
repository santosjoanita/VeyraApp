import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  showPassword = signal<boolean>(false);
  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }
}