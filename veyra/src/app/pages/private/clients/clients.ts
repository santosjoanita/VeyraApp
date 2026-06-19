import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { AddClientModal } from '../../../core/components/modals/add-client/add-client';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';
import { DataHandlerService } from '../../../core/services/data-handler.service';
import { ClientsService } from '../../../core/services/clients/clients.service';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { Client } from '../../../core/class/client.model';
import { Paginator } from '../../../core/components/paginator/paginator';

import { MessageService } from 'primeng/api';

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
    Paginator,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  private dataHandler = inject(DataHandlerService);
  private clientsService = inject(ClientsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private messageService = inject(MessageService);

  showAddClient = signal(false);
  showDeleteModal = signal(false);
  itemToDeleteId = signal<string | null>(null);
  itemToDeleteName = signal('');
  sortOrder = signal<'asc' | 'desc'>('asc');
  clientsList = signal<Client[]>([]);

  itemToEdit = signal<any>(null);

  private _currentPage = signal(1);
  private _pageSize = signal(5);

  private _searchQuery = signal('');
  private _projectsList = signal<any[]>([]);

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  get currentPage() {
    return this._currentPage();
  }
  get pageSize() {
    return this._pageSize();
  }

  get searchQuery() {
    return this._searchQuery();
  }
  set searchQuery(value: string) {
    this._searchQuery.set(value);
    this._currentPage.set(1);
  }

  private _filteredClients = computed(() => {
    const clients = this.clientsList();
    const projects = this._projectsList();

    const enrichedClients = clients.map((client) => {
      const activeCount = projects.filter(
        (p) => p.clientId === client.id && p.status === 'active',
      ).length;

      return {
        ...client,
        activeProjects: activeCount,
      };
    });

    let result = this.dataHandler.filterArray(enrichedClients, this.searchQuery, ['name', 'email']);
    return this.dataHandler.sortArray(result, 'name', this.sortOrder());
  });

  get totalClientsCount() {
    return this._filteredClients().length;
  }

  private _displayedClients = computed(() => {
    const list = this._filteredClients();
    const startIndex = (this._currentPage() - 1) * this._pageSize();
    return list.slice(startIndex, startIndex + this._pageSize());
  });

  get displayedClients() {
    return this._displayedClients();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (!params['page'] || !params['limit']) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: 1, limit: 5 },
          queryParamsHandling: 'merge',
        });
        return;
      }

      this._currentPage.set(Number(params['page']));
      this._pageSize.set(Number(params['limit']));
    });

    this.loadClients();
    this.loadProjects();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: event.pageIndex,
        limit: event.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  loadClients() {
    this.clientsService.getClients().subscribe({
      next: (data) => this.clientsList.set(data),
      error: (err) => {
        console.error('Error while loading clients', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Error while loading clients',
        });
      },
    });
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (data) => this._projectsList.set(data),
      error: (err) => console.error('Error while loading projects', err),
    });
  }

  toggleSort(): void {
    this._sortOrder.update((order) => (order === 'asc' ? 'desc' : 'asc'));
  }

  viewClient(id: any): void {
    this.router.navigate(['/clients/details', String(id)]);
  }

  openEditModal(client: any): void {
    this.itemToEdit.set(client);
    this.showAddClient.set(true);
  }

  openCreateModal(): void {
    this.itemToEdit.set(null);
    this.showAddClient.set(true);
  }

  closeModal(): void {
    this.showAddClient.set(false);
    this.itemToEdit.set(null);
  }

  handleSaveClient(clientData: any) {
    const editing = this.itemToEdit();

    if (editing) {
      const payload = { ...clientData };
      delete payload.id;

      this.clientsService.updateClient(editing.id, payload).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Client updated successfully!',
          });
        },
        error: (err) => {
          console.error('Error while updating client', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update client.',
          });
        },
      });
    } else {
      this.clientsService.createClient(clientData).subscribe({
        next: (createdClient) => {
          this.clientsList.update((list) => [...list, createdClient]);
          this.closeModal();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Client created successfully!',
          });
        },
        error: (err) => {
          console.error('Error while creating client', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create client.',
          });
        },
      });
    }
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
          this.clientsList.update((list) => list.filter((c) => c.id !== id));
          this.showDeleteModal.set(false);
          this.itemToDeleteId.set(null);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Cliente deleted with success',
          });
        },
        error: (err) => {
          console.error('Error while deleting client', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'It was not possible to delete the client',
          });
        },
      });
    }
  }
}
