import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  inject,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/user/auth.service';
import { WorkersService } from '../../../../core/services/workers/workers.service';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-user.html',
  styleUrl: './register-user.css',
})
export class RegisterUser implements OnInit {
  private authService = inject(AuthService);
  private workersService = inject(WorkersService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  showPassword = signal(false);

  @Input()
  set editData(value: any) {
    if (value) {
      this._editDataPrivate = value;
      this.registerData = {
        name: value.name || '',
        email: value.email || '',
        password: '',
        role: value.role || 'worker',
      };
      this.showPassword.set(false);
      this.cdr.detectChanges();
    } else {
      this._editDataPrivate = null;
      this.resetForm();
    }
  }

  private _editDataPrivate: any = null;
  get editData(): any {
    return this._editDataPrivate;
  }

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  registerData = {
    name: '',
    email: '',
    password: '',
    role: 'worker',
  };

  isLoading = false;

  ngOnInit() {}

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  closeModal(): void {
    this.close.emit();
    this.resetForm();
    this.cdr.detectChanges();
  }

  handleRegister(): void {
    if (
      !this.registerData.name ||
      !this.registerData.email ||
      (!this.editData && !this.registerData.password)
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all mandatory fields.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Email',
        detail: 'Please enter a valid email address (e.g., name@example.com).',
      });
      return;
    }

    if (this.registerData.password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!passwordRegex.test(this.registerData.password)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Weak Password',
          detail:
            'Password must be at least 8 characters long, contain one uppercase letter and one number.',
        });
        return;
      }
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    if (this.editData) {
      const updatePayload: any = {
        name: this.registerData.name,
        role: this.registerData.role,
      };

      if (this.registerData.password) {
        updatePayload.password = this.registerData.password;
      }

      this.workersService.updateWorker(this.editData.id, updatePayload).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully!',
          });
          this.saved.emit(response);
          this.closeModal();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error updating user:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update user.',
          });
          this.cdr.detectChanges();
        },
      });
    } else {
      const registerPayload = {
        name: this.registerData.name,
        email: this.registerData.email,
        password: this.registerData.password,
      };

      this.authService.register(registerPayload).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User registered successfully!',
          });
          this.saved.emit(response);
          this.closeModal();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error registering new user:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to register user. Please check the provided data.',
          });
          this.cdr.detectChanges();
        },
      });
    }
  }

  private resetForm(): void {
    this.registerData = {
      name: '',
      email: '',
      password: '',
      role: 'worker',
    };
    this.showPassword.set(false);
  }
}
