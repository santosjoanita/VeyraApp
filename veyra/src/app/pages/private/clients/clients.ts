import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { AddClientModal } from '../../../core/components/modals/add-client/add-client';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';

import { DataHandlerService } from '../../../core/services/data-handler.service';
import { Client } from '../../../core/class/client.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Sidebar,
    Header,
    AddClientModal,
    ConfirmDelete,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients {
  constructor(private dataHandler: DataHandlerService) {}

  showAddClient = false;
  showDeleteModal = false;
  itemToDeleteId: string | null = null;
  itemToDeleteName: string = '';

  searchQuery: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  clientsList: Client[] = [];

  get displayedClients(): Client[] {
    let result = this.dataHandler.filterArray(this.clientsList, this.searchQuery, [
      'name',
      'email',
    ]);
    return this.dataHandler.sortArray(result, 'name', this.sortOrder);
  }

  toggleSort(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  handleSaveClient(newClientData: any) {
    this.clientsList.push({
      id: 'c_new_' + Math.random().toString(36).substr(2, 9),
      name: newClientData.name,
      email: newClientData.email,
      phone: newClientData.phone,
      notes: newClientData.notes,
      isActive: true,
      ActiveProjects: 0,
      createdAt: new Date().toISOString(),
    });
    this.showAddClient = false;
  }

  viewClient(id: string): void {
    console.log('View client ID:', id);
  }

  editClient(id: string): void {
    console.log('Edit client ID:', id);
  }

  openDeleteModal(client: any) {
    this.itemToDeleteId = client.id;
    this.itemToDeleteName = client.name;
    this.showDeleteModal = true;
  }

  handleConfirmDelete() {
    if (this.itemToDeleteId) {
      this.clientsList = this.clientsList.filter((c) => c.id !== this.itemToDeleteId);
    }
    this.showDeleteModal = false;
    this.itemToDeleteId = null;
  }
}
