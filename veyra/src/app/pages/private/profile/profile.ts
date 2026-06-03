import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

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

  private backupUser = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
  };

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (data) => {
        if (data) {
          const actualUser = data.user || data;
          const nameParts = (actualUser.name || '').split(' ');

          this.currentUser = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: actualUser.email || '',
            role: actualUser.role || 'worker',
            password: '••••••••',
          };

          this.backupUser = { ...this.currentUser };

          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error while loading profile', err);
        this.cdr.detectChanges();
      },
    });
  }

  startEditing(): void {
    this.isEditing = true;
    this.cdr.detectChanges();
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.currentUser = { ...this.backupUser };
    this.cdr.detectChanges();
  }

  saveChanges(): void {
    console.log('Data to send to API:', this.currentUser);
    this.isEditing = false;
    this.backupUser = { ...this.currentUser };
    this.cdr.detectChanges();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.cdr.detectChanges();
  }

  changePassword(): void {
    alert('Active this to implement password change functionality!');
  }
}
