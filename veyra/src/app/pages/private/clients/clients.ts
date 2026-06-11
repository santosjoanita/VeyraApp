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
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { Client } from '../../../core/class/client.model';
import { Paginator } from '../../../core/components/paginator/paginator';

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
  private projectsService = inject(ProjectsService);

  showAddClient = signal(false);
  showDeleteModal = signal(false);
  itemToDeleteId = signal<string | null>(null);
  itemToDeleteName = signal('');
  sortOrder = signal<'asc' | 'desc'>('asc');
  clientsList = signal<Client[]>([]);

  private _currentPage = signal(1);
  private _pageSize = signal(10);
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
    this.loadClients();
    this.loadProjects();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this._currentPage.set(event.pageIndex);
    this._pageSize.set(event.pageSize);
  }

  loadClients() {
    this.clientsService.getClients().subscribe({
      next: (data) => this.clientsList.set(data),
      error: (err) => console.error('Error while loading clients', err),
    });
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (data) => this._projectsList.set(data),
      error: (err) => console.error('Erro ao carregar projetos para os clientes', err),
    });
  }
  toggleSort(): void {
    this.sortOrder.update((order) => (order === 'asc' ? 'desc' : 'asc'));
  }

  viewClient(id: string): void {
    this.router.navigate(['/clients/details', id]);
  }

  editClient(id: string): void {
    this.router.navigate(['/clients/details', id]);
  }

  handleSaveClient(newClientData: any) {
    this.clientsService.createClient(newClientData).subscribe({
      next: (createdClient) => {
        this.clientsList.update((list) => [...list, createdClient]);
        this.showAddClient.set(false);
      },
      error: (err) => console.error('Error while creating client', err),
    });
  }

  openDeleteModal(client: Client) {
    this.itemToDeleteId.set(client.id);
    this.itemToDeleteName.set(client.name);
    this.showDeleteModal.set(true);
  }

  handleConfirmDelete() {
    const id = this.itemToDeleteId();
    if (id) {
      this.clientsService.deleteClient(id).subscribe({
        next: () => {
          this.clientsList.update((list) => list.filter((c) => c.id !== id));
          this.showDeleteModal.set(false);
          this.itemToDeleteId.set(null);
        },
        error: (err) => console.error('Error while deleting client', err),
      });
    }
  }
}
