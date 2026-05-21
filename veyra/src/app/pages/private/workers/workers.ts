import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';

export interface Worker {
  id?: number;
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
  imports: [CommonModule, Sidebar, Header], 
  templateUrl: './workers.html',
  styleUrl: './workers.css'
})
export class Workers {
  //enquanto a api n vem
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

  viewWorker(id?: number) {
    console.log('View worker ID:', id);
  }

  editWorker(id?: number) {
    console.log('Edit worker ID:', id);
  }

  deleteWorker(id?: number) {
    console.log('Delete worker ID:', id);
  }

  changeProfile(id: number | undefined, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newProfile = selectElement.value;
    
    if (id !== undefined) {
      console.log(`Change worker ID: ${id} to role: ${newProfile}`);
    } else {
      console.error('Cannot change profile: Worker ID is missing.');
    }
  }
}