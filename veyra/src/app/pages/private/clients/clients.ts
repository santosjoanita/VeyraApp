import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { AddClientModal } from '../../../core/components/modals/add-client/add-client';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';
import { DataHandlerService } from '../../../core/services/data-handler.service';

import { ClientsService } from '../../../core/services/clients/clients.service';
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
export class Clients implements OnInit {
  showAddClient = false;
  showDeleteModal = false;
  itemToDeleteId: string | null = null;
  itemToDeleteName: string = '';

  searchQuery: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  clientsList: Client[] = [];

  constructor(
    private dataHandler: DataHandlerService,
    private clientsService: ClientsService,
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientsService.getClients().subscribe({
      next: (data) => (this.clientsList = data),
      error: (err) => console.error('Erro ao carregar clientes', err),
    });
  }

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
    this.clientsService.createClient(newClientData).subscribe({
      next: (createdClient) => {
        this.clientsList.push(createdClient);
        this.showAddClient = false;
      },
      error: (err) => console.error('Erro ao criar cliente', err),
    });
  }

  openDeleteModal(client: Client) {
    this.itemToDeleteId = client.id;
    this.itemToDeleteName = client.name;
    this.showDeleteModal = true;
  }

  handleConfirmDelete() {
    if (this.itemToDeleteId) {
      this.clientsService.deleteClient(this.itemToDeleteId).subscribe({
        next: () => {
          this.clientsList = this.clientsList.filter((c) => c.id !== this.itemToDeleteId);
          this.showDeleteModal = false;
          this.itemToDeleteId = null;
        },
        error: (err) => console.error('Erro ao apagar cliente', err),
      });
    }
  }
}
