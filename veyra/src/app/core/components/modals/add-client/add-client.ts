import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-client-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-client.html',
  styleUrls: [],
})
export class AddClientModal implements OnInit {
  @Input() editData: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData = {
    name: '',
    email: '',
    phone: '',
    notes: '',
  };

  ngOnInit() {
    if (this.editData) {
      this.formData = {
        name: this.editData.name || '',
        email: this.editData.email || '',
        phone: this.editData.phone || '',
        notes: this.editData.notes || '',
      };
    }
  }

  submitForm() {
    if (this.editData) {
      this.save.emit({ ...this.formData, id: this.editData.id });
    } else {
      this.save.emit(this.formData);
    }
  }

  cancel() {
    this.close.emit();
  }
}
