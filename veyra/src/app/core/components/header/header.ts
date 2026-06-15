import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/user/auth.service';
import { RegisterUser } from '../modals/register-user/register-user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RegisterUser],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  private authService = inject(AuthService);

  currentUser = {
    name: localStorage.getItem('userName') || 'Admin',
    role: localStorage.getItem('userRole') || 'admin',
  };

  isModalOpen = false;

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (userData) => {
        if (userData) {
          const actualUser = userData.user || userData;
          this.currentUser.name = actualUser.name || this.currentUser.name;
          localStorage.setItem('userName', this.currentUser.name);
        }
      },
      error: (err) => console.error('Erro silencioso no header', err),
    });
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }
}
