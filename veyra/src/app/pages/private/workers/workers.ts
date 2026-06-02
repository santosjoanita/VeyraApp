import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';
import { AddWorkerModal } from '../../../core/components/modals/add-worker/add-worker';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';

import { DataHandlerService } from '../../../core/services/data-handler.service';
import {Worker} from '../../../core/class/worker.model';


@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Sidebar, Header, AddWorkerModal, ConfirmDelete],
  templateUrl: './workers.html',
  styleUrl: './workers.css'
})
export class Workers {
  
  constructor(private dataHandler: DataHandlerService) {}

  showAddWorker = false;
  showDeleteModal = false;
  itemToDeleteId: string | number | null = null;
  itemToDeleteName: string = '';

  searchQuery: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  selectedRole: string = 'all';

  workersList: Worker[] = [
    { id: 1, name: 'Dexter Morgan', email: 'dexter@veyra.com', role: 'admin', status: 'active', lastAccess: '2 hours ago' },
    { id: 2, name: 'Debra Morgan', email: 'debra@veyra.com', role: 'worker', status: 'inactive', lastAccess: '3 days ago' },
    { id: 3, name: 'Angel Batista', email: 'angel@veyra.com', role: 'worker', status: 'active', lastAccess: 'Yesterday' }
  ];

  get displayedWorkers(): Worker[] {
    let result = this.dataHandler.filterArray(this.workersList, this.searchQuery, ['name', 'email']);
    result = this.dataHandler.filterArrayByValue(result, 'role', this.selectedRole);
    return this.dataHandler.sortArray(result, 'name', this.sortOrder);
  }

  toggleSort(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  handleSaveWorker(newWorkerData: any) {
    this.workersList.push({
      id: 'w_new_' + Math.random().toString(36).substr(2, 9),
      name: newWorkerData.name,
      email: newWorkerData.email,
      role: newWorkerData.role,
      status: 'active',
      lastAccess: 'Just now'
    });
    this.showAddWorker = false;
  }

  openDeleteModal(worker: any) {
    this.itemToDeleteId = worker.id;
    this.itemToDeleteName = worker.name;
    this.showDeleteModal = true;
  }

  handleConfirmDelete() {
    if (this.itemToDeleteId) {
      this.workersList = this.workersList.filter(w => w.id !== this.itemToDeleteId);
    }
    this.showDeleteModal = false;
    this.itemToDeleteId = null;
  }

  changeProfile(id: string | number, event: any): void {
    const newRole = event.target.value;
    const worker = this.workersList.find(w => w.id === id);
    if (worker) {
      worker.role = newRole;
    }
  }

  viewWorker(id: string | number): void {
    console.log('View worker ID:', id);
  }

  editWorker(id: string | number): void {
    console.log('Edit worker ID:', id);
  }
}