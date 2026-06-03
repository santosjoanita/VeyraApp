import { Component, OnInit, signal, inject } from '@angular/core';
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

  private _currentUser = signal<any>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
  });

  private _settings = signal<any>({
    activityLog: true,
    twoFactorAuth: false,
    theme: 'dark',
  });

  private _isEditing = signal(false);
  private _showPassword = signal(false);
  private backupUser: any = {};

  get currentUser() {
    return this._currentUser();
  }
  set currentUser(value: any) {
    this._currentUser.set(value);
  }

  get settings() {
    return this._settings();
  }
  set settings(value: any) {
    this._settings.set(value);
  }

  get isEditing() {
    return this._isEditing();
  }
  get showPassword() {
    return this._showPassword();
  }

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (data: any) => {
        if (data) {
          const names = (data.name || '').split(' ');
          this._currentUser.set({
            firstName: names[0] || '',
            lastName: names.slice(1).join(' ') || '',
            email: data.email || '',
            password: '••••••••',
            role: data.role || 'worker',
          });
          this.backupUser = { ...this._currentUser() };
        }
      },
      error: (err) => console.error('Error while loading user profile', err),
    });
  }

  startEditing() {
    this._isEditing.set(true);
  }

  cancelEditing() {
    this._isEditing.set(false);
    this._currentUser.set({ ...this.backupUser });
  }

  saveChanges() {
    console.log('Profile information successfully updated', this.currentUser);
    this.backupUser = { ...this.currentUser };
    this._isEditing.set(false);
  }

  togglePassword() {
    this._showPassword.update((val) => !val);
  }

  changePassword() {
    console.log('Password change requested', this.currentUser);
  }
}
