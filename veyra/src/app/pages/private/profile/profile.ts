import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { AuthService } from '../../../core/services/user/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Header],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  currentUser = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
  };

  settings = {
    activityLog: true,
    twoFactorAuth: false,
    theme: 'light',
  };

  isEditing = false;
  showPassword = false;

  private backupUser: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
  } = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (data) => {
        if (data) {
          this.currentUser = {
            firstName: data.name?.first || '',
            lastName: data.name?.last || '',
            email: data.email || '',
            role: data.role || 'worker',
            password: '••••••••',
          };

          this.backupUser = { ...this.currentUser };
        }
      },
      error: (err) => console.error('Erro ao carregar perfil', err),
    });
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.currentUser = { ...this.backupUser };
  }

  saveChanges(): void {
    console.log('Dados a enviar para a API:', this.currentUser);
    this.isEditing = false;
    this.backupUser = { ...this.currentUser };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  changePassword(): void {
    alert('Funcionalidade de alteração de palavra-passe ativa.');
  }
}
