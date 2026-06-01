import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/Auth-Service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register{
  showPassword = signal<boolean>(false);
  
  registerData = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  onRegister(): void {
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
      alert('Por favor, preenche todos os campos.');
      return;
    }

    const result = this.authService.register(this.registerData);
    if (!result.success) {
      alert(result.message);
      return;
    }

    alert(result.message);
    this.router.navigate(['/login']);
  }
}