import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-project.html',
  styleUrls: []
})
export class AddProjectModal {
  @Input() clients: any[] = []; 
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData = {
    clientId: '',
    name: '',
    description: '',
    status: 'active',
    startDate: '',
    endDate: ''
  };

  submitForm() {
    this.save.emit(this.formData);
  }

  cancel() {
    this.close.emit();
  }
}