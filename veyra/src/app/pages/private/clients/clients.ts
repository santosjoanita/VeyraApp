import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';
import { AddClientModal} from '../../../core/components/modals/add-client/add-client';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ActiveProjects?: number;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header, AddClientModal, ConfirmDelete],
  templateUrl: './clients.html',
  styleUrl: './clients.css' 
})
export class Clients {
  showAddClient = false;
  showDeleteModal = false;
  clientToDeleteId: string | null = null;
  clientToDeleteName: string = '';

  handleSaveClient(newClientData: any) {
    console.log('Fazer POST /clients com:', newClientData);
    
    this.clientsList.push({
      id: 'c_new_' + Math.random().toString(36).substr(2, 9), 
      name: newClientData.name,
      email: newClientData.email,
      phone: newClientData.phone,
      notes: newClientData.notes,
      isActive: newClientData.isActive || false,
      createdAt: newClientData.createdAt || new Date().toISOString(),
      updatedAt: newClientData.updatedAt || new Date().toISOString(),
      ActiveProjects: newClientData.ActiveProjects || 0
    });
    
    this.showAddClient = false;
  }

  //simulei a lista da API mas com json
  
  clientsList: Client[] = [
    {
      id: 'c1',
      name: 'Acme Corp',
      email: 'contact@acmecorp.com',
      phone: '+351 912 345 678',
      notes: 'VIP Client',
      isActive: true,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-02-20T14:30:00Z',
      ActiveProjects: 3
    },
    {
      id: 'c2',
      name: 'Global Industries',
      email: 'info@globalind.com',
      phone: '+351 965 432 198',
      notes: 'Pending contract renewal',
      isActive: false,
      createdAt: '2025-03-05T09:15:00Z',
      updatedAt: '2025-03-10T11:00:00Z',
      ActiveProjects: 0
    }
  ];

  viewClient(id: string): void {
    console.log('View client ID:', id);
  }

  editClient(id: string): void {
    console.log('Edit client ID:', id);
  }

   openDeleteModal(client: any) {
    this.clientToDeleteId = client.id;
    this.clientToDeleteName = client.name; 
    this.showDeleteModal = true;
  }

    handleConfirmDelete() {
    if (this.clientToDeleteId) {
      this.clientsList = this.clientsList.filter(c => c.id !== this.clientToDeleteId);
    }
    this.showDeleteModal = false; 
    this.clientToDeleteId = null;
  }
}