import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-vacation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-vacation-modal.html',
  styleUrl: './add-vacation-modal.css',
})
export class AddVacationModal {
  @Input() workers: any[] = [];
  @Input() isAdmin: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  vacationData = {
    userId: '',
    startDate: '',
    endDate: '',
    note: '',
  };

  onSubmit() {
    if (!this.vacationData.startDate || !this.vacationData.endDate) {
      alert('Please, select both start and end dates.');
      return;
    }

    this.save.emit(this.vacationData);
  }
}
