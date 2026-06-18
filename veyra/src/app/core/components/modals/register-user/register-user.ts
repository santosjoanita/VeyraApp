import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/user/auth.service';

import { WorkersService } from '../../../../core/services/workers/workers.service';

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
      alert('Please fill in all mandatory fields.');
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const { role, password, ...payload } = this.registerData;

    if (this.editData) {
      const updatePayload: any = { ...payload, role };
      if (password) updatePayload.password = password;

      this.workersService.updateWorker(this.editData.id, updatePayload).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.saved.emit(response);
          this.closeModal();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error updating user:', err);
          alert('Failed to update user.');
          this.cdr.detectChanges();
        },
      });
    } else {
      this.authService.register(this.registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.saved.emit(response);
          this.closeModal();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error registering new user:', err);
          alert('Failed to register user. Please try again.');
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
  }
}
