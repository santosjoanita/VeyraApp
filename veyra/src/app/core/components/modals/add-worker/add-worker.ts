import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-worker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-worker.html',
  styleUrls: []
})
export class AddWorkerModal {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData = {
    name: '',
    email: '',
    password: '',
    role: 'worker' //está este por default mas depois o admin pode mudar 
  };

  submitForm() {
    this.save.emit(this.formData);
  }

  cancel() {
    this.close.emit();
  }
}