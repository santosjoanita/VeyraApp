import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

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

  constructor(private router: Router) {}

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  onRegister(): void {
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
      alert('Por favor, preenche todos os campos.');
      return;
    }

    const usersStr = localStorage.getItem('veyra_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    const exists = users.find((u: any) => u.email === this.registerData.email || u.username === this.registerData.username);
    if (exists) {
      alert('Username ou E-mail já existem!');
      return;
    }

    const newUser = {
      ...this.registerData,
      role: users.length === 0 ? 'admin' : 'worker'
    };
    
    users.push(newUser);
    localStorage.setItem('veyra_users', JSON.stringify(users));
    
    alert('Registo com sucesso! Podes fazer o login.');
    this.router.navigate(['/login']);
  }
}