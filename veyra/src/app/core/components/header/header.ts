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

  currentUser = { name: 'Loading...', role: '' };

  isModalOpen = false;

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (userData) => {
        if (userData) {
          this.currentUser = userData;
        }
      },
      error: (err) => {
        console.error('Error fetching user profile for header', err);
        this.currentUser = { name: 'User', role: 'worker' };
      },
    });
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
  }
}
