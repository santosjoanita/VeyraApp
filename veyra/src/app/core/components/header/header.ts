import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/user/auth.service';
import { RegisterUser } from '../modals/register-user/register-user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RegisterUser],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);

  private _searchQuery = signal('');

  currentUser = {
    name: localStorage.getItem('userName') || 'Admin',
    role: localStorage.getItem('userRole') || 'admin',
  };

  isModalOpen = false;

  get showBackButton(): boolean {
    return this.router.url.includes('/details');
  }

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  get searchQuery() {
    return this._searchQuery();
  }
  set searchQuery(value: string) {
    this._searchQuery.set(value);
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
      error: (err) => console.error('Silent error on header', err),
    });
  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}
