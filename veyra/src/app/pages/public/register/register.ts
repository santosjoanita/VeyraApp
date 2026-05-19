import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register{
  showPassword = signal<boolean>(false);
  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }
  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern('.*[A-Z].*') 
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email 
    ]),
    password: new FormControl('', [Validators.required])
  });

  get usernameControl() { return this.registerForm.get('username'); }
  get emailControl() { return this.registerForm.get('email'); }
}