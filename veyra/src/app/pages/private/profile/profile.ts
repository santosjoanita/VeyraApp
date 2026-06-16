import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { AuthService } from '../../../core/services/user/auth.service';
import { WorkersService } from '../../../core/services/workers/workers.service';
import { PreferencesService } from '../../../core/services/preferences.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Header],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private workersService = inject(WorkersService);
  private cdr = inject(ChangeDetectorRef);
  private preferencesService = inject(PreferencesService);

  currentUser: any = {
    id: null,
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
  errorMessage = '';

  get isAdmin(): boolean {
    return this.currentUser.role === 'admin' || localStorage.getItem('userRole') === 'admin';
  }

  private backupUser: any = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
  };
  get showActivityLog() {
    return this.preferencesService.showActivityLog;
  }

  onToggleActivity(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.preferencesService.setActivityLog(checkbox.checked);
  }

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (data) => {
        if (data) {
          const actualUser = data.user || data;
          const nameParts = (actualUser.name || '').split(' ');

          this.currentUser = {
            id: actualUser.id || null,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: actualUser.email || '',
            role: actualUser.role || 'worker',
            password: '',
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
    this.showPassword = false;
    this.cdr.detectChanges();
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.currentUser = { ...this.backupUser };
    this.cdr.detectChanges();
  }

  saveChanges(): void {
    const payload: any = {};
    const currentName = [this.currentUser.firstName, this.currentUser.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    const backupName = [this.backupUser.firstName, this.backupUser.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    if (currentName && currentName !== backupName) {
      payload.name = currentName;
    }

    const unsupportedFields: string[] = [];
    if (this.currentUser.email !== this.backupUser.email) {
      unsupportedFields.push('email');
    }
    if (this.currentUser.password) {
      unsupportedFields.push('password');
    }

    if (!payload.name) {
      if (unsupportedFields.length) {
        this.errorMessage =
          'Email and password cannot be updated here. Only name changes are supported.';
        return;
      }

      this.isEditing = false;
      this.currentUser.password = '';
      this.cdr.detectChanges();
      return;
    }

    if (!this.currentUser.id) {
      console.error('Cannot save profile: current user id is missing.');
      return;
    }

    if (unsupportedFields.length) {
      this.errorMessage =
        'Email and password changes are not saved here; only name changes are applied.';
    } else {
      this.errorMessage = '';
    }

    this.workersService.updateWorker(this.currentUser.id, payload).subscribe({
      next: (updatedUser) => {
        const nameParts = (updatedUser.name || currentName).split(' ');
        this.currentUser = {
          id: updatedUser.id || this.currentUser.id,
          firstName: nameParts[0] || this.currentUser.firstName,
          lastName: nameParts.slice(1).join(' ') || this.currentUser.lastName,
          email: updatedUser.email || this.currentUser.email,
          role: updatedUser.role || this.currentUser.role,
          password: '',
        };

        if (this.currentUser.firstName || this.currentUser.lastName) {
          localStorage.setItem(
            'userName',
            `${this.currentUser.firstName} ${this.currentUser.lastName}`.trim(),
          );
        }

        this.backupUser = { ...this.currentUser };
        this.isEditing = false;
        this.showPassword = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error saving profile:', err);
        this.errorMessage = 'Unable to save profile. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  changePassword(): void {
    alert('Active this to implement password change functionality!');
  }
}
