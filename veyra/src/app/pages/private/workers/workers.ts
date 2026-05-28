import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';
import { AddWorkerModal } from '../../../core/components/modals/add-worker/add-worker'; 
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';

export interface Worker {
  id?: string | number; 
  name: string;
  email: string;
  password?: string;
  role: string;
  status?: 'active' | 'inactive'; 
  lastAccess?: string;
}

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [CommonModule, Sidebar, Header, RouterModule, AddWorkerModal, ConfirmDelete], 
  templateUrl: './workers.html',
  styleUrl: './workers.css'
})
export class Workers {
  showAddWorker = false;
  showDeleteModal = false;
  workerToDeleteId: string | null = null;
  workerToDeleteName: string = '';
  // Enquanto a api não vem
  workersList: Worker[] = [
    {
      id: 1,
      name: 'Dexter Morgan',
      email: 'dexter@veyra.com',
      role: 'admin',
      status: 'active',
      lastAccess: '2 hours ago'
    },
    {
      id: 2,
      name: 'Debra Morgan',
      email: 'debra@veyra.com',
      role: 'worker',
      status: 'inactive',
      lastAccess: '3 days ago'
    },
    {
      id: 3,
      name: 'Angel Batista',
      email: 'angel@veyra.com',
      role: 'worker',
      status: 'active',
      lastAccess: 'Yesterday'
    }
  ];

  handleSaveWorker(newWorkerData: any) {
    console.log('Fazer POST /workers com:', newWorkerData);
    
    this.workersList.push({
      id: 'w_new_' + Math.random().toString(36).substr(2, 9), 
      name: newWorkerData.name,
      email: newWorkerData.email,
      role: newWorkerData.role,
      status: newWorkerData.status || 'active',
      lastAccess: newWorkerData.lastAccess || 'Just now'
    });
    
    this.showAddWorker = false;
  }
  viewWorker(id?: string | number) {
    console.log('View worker ID:', id);
  }

  editWorker(id?: string | number) {
    console.log('Edit worker ID:', id);
  }

  deleteWorker(id?: string | number) {
    console.log('Delete worker ID:', id);
  }

  changeProfile(id: string | number | undefined, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newProfile = selectElement.value;
    
    if (id !== undefined) {
      console.log(`Change worker ID: ${id} to role: ${newProfile}`);
    } else {
      console.error('Cannot change profile: Worker ID is missing.');
    }
  }
   openDeleteModal(worker: any) {
    this.workerToDeleteId = worker.id;
    this.workerToDeleteName = worker.name; 
    this.showDeleteModal = true;
  }

    handleConfirmDelete() {
    if (this.workerToDeleteId) {
      this.workersList = this.workersList.filter(w => w.id !== this.workerToDeleteId);
    }
    this.showDeleteModal = false; 
    this.workerToDeleteId = null;
  }
}