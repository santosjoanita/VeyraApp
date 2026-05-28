import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete.html',
  styleUrl: './confirm-delete.css',
})
export class ConfirmDelete {
  @Input() itemName: string = 'this item'; 
  
  @Output() confirm = new EventEmitter<void>();
  
  @Output() close = new EventEmitter<void>();

  confirmDelete() {
    this.confirm.emit();
  }

  cancel() {
    this.close.emit();
  }
}