import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header], 
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  showPassword = false;
  isEditing = false; 

  currentUser = {
    firstName: 'Dexter',
    lastName: 'Morgan',
    email: 'morgan.dexter@branditdigitalmedia.com',
    password: 'password123',
    role: 'admin'
  };

  settings = {
    activityLog: true,
    twoFactorAuth: false,
    theme: 'light'
  };

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  startEditing(): void {
    this.isEditing = true; 
  }

  saveChanges(): void {
    console.log('Save changes to API:', this.currentUser);
    this.isEditing = false; 
  }

  cancelEditing(): void {
    console.log('Edit cancelled');
    this.isEditing = false; 
  }

  changePassword(): void {
    console.log('Change password clicked');
  }
}