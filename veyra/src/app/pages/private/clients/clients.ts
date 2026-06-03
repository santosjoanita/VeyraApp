import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  private dataHandler = inject(DataHandlerService);
  private clientsService = inject(ClientsService);
  private router = inject(Router);

  private _showAddClient = signal(false);
  private _showDeleteModal = signal(false);
  private _itemToDeleteId = signal<any>(null);
  private _itemToDeleteName = signal('');
  private _sortOrder = signal<'asc' | 'desc'>('asc');
  private _clientsList = signal<Client[]>([]);
  private _searchQuery = signal('');

  get showAddClient() {
    return this._showAddClient();
  }
  set showAddClient(value: boolean) {
    this._showAddClient.set(value);
  }

  get showDeleteModal() {
    return this._showDeleteModal();
  }
  set showDeleteModal(value: boolean) {
    this._showDeleteModal.set(value);
  }

  get itemToDeleteName() {
    return this._itemToDeleteName();
  }
  set itemToDeleteName(value: string) {
    this._itemToDeleteName.set(value);
  }

  get sortOrder() {
    return this._sortOrder();
  }
  set sortOrder(value: 'asc' | 'desc') {
    this._sortOrder.set(value);
  }

  get clientsList() {
    return this._clientsList();
  }

  get searchQuery() {
    return this._searchQuery();
  }
  set searchQuery(value: string) {
    this._searchQuery.set(value);
  }

  private _displayedClients = computed(() => {
    let result = this.dataHandler.filterArray(this._clientsList(), this.searchQuery, [
      'name',
      'email',
    ]);
    return this.dataHandler.sortArray(result, 'name', this.sortOrder);
  });

  get displayedClients() {
    return this._displayedClients();
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientsService.getClients().subscribe({
      next: (data) => this._clientsList.set(data),
      error: (err) => console.error('Error loading clients', err),
    });
  }

  toggleSort(): void {
    this._sortOrder.update((order) => (order === 'asc' ? 'desc' : 'asc'));
  }

  viewClient(id: any): void {
    this.router.navigate(['/clients/details', String(id)]);
  }

  editClient(id: any): void {
    this.router.navigate(['/clients/details', String(id)]);
  }

  handleSaveClient(newClientData: any) {
    this.clientsService.createClient(newClientData).subscribe({
      next: (createdClient) => {
        this._clientsList.update((list) => [...list, createdClient]);
        this._showAddClient.set(false);
      },
      error: (err) => console.error('Error creating client', err),
    });
  }

  openDeleteModal(client: Client) {
    this._itemToDeleteId.set(client.id || null);
    this._itemToDeleteName.set(client.name || '');
    this._showDeleteModal.set(true);
  }

  handleConfirmDelete() {
    const id = this._itemToDeleteId();
    if (id) {
      this.clientsService.deleteClient(id).subscribe({
        next: () => {
          this._clientsList.update((list) => list.filter((c) => c.id !== id));
          this._showDeleteModal.set(false);
          this._itemToDeleteId.set(null);
        },
        error: (err) => console.error('Error deleting client', err),
      });
    }
  }
}
