import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';

// Interface baseada no JSON que forneceste
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header],
  templateUrl: './clients.html',
  styleUrl: './clients.css' 
})
export class Clients {

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
      updatedAt: '2025-02-20T14:30:00Z'
    },
    {
      id: 'c2',
      name: 'Global Industries',
      email: 'info@globalind.com',
      phone: '+351 965 432 198',
      notes: 'Pending contract renewal',
      isActive: false,
      createdAt: '2025-03-05T09:15:00Z',
      updatedAt: '2025-03-10T11:00:00Z'
    }
  ];

  viewClient(id: string): void {
    console.log('View client ID:', id);
  }

  editClient(id: string): void {
    console.log('Edit client ID:', id);
  }

  deleteClient(id: string): void {
    console.log('Delete client ID:', id);
  }
}