import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-client-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-client.html',
  styleUrls: [] 
})
export class AddClientModal {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData = {
    name: '',
    email: '',
    phone: '',
    notes: ''
  };

  submitForm() {
    this.save.emit(this.formData);
  }

  cancel() {
    this.close.emit();
  }
}