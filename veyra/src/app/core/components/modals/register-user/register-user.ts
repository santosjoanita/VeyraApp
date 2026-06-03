import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/user/auth.service';
import { WorkersService } from '../../../../core/services/workers/workers.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-user.html',
  styleUrl: './register-user.css',
})
export class RegisterUser {
  private authService = inject(AuthService);
  private workersService = inject(WorkersService);

  @Output() close = new EventEmitter<void>();
  errorMessage = signal('');

  registerData = {
    name: { first: '', last: '' },
    email: '',
    password: '',
    role: 'worker',
  };

  onRegister() {
    this.errorMessage.set('');

    if (
      !this.registerData.name.first ||
      !this.registerData.name.last ||
      !this.registerData.email ||
      !this.registerData.password
    ) {
      this.errorMessage.set('Por favor, preencha todos os campos.');
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: () => {
        alert('Utilizador criado com sucesso!');
        this.workersService.triggerRefresh();
        this.close.emit();
      },
      error: (err) => {
        console.error('Erro ao registar utilizador', err);
        this.errorMessage.set('Erro ao criar o utilizador. Verifique os dados.');
      },
    });
  }

  closeModal() {
    this.close.emit();
  }
}
