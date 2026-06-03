import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { AuthService } from '../../../core/services/user/auth.service';
import { User } from '../../../core/class/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Header],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: User | null = null;
  isEditing = false;
  editData: Partial<User> = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (data) => {
        this.user = data;
        this.editData = { ...data };
      },
      error: (err) => console.error('Erro ao carregar perfil', err),
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.editData = { ...this.user };
    }
  }

  saveProfile() {
    console.log('Dados do perfil a enviar para a API:', this.editData);
    this.isEditing = false;
  }
}
