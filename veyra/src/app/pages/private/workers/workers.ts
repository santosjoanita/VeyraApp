import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { AddWorkerModal } from '../../../core/components/modals/add-worker/add-worker';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';
import { DataHandlerService } from '../../../core/services/data-handler.service';
import { WorkersService } from '../../../core/services/workers/workers.service';
import { Worker } from '../../../core/class/worker.model';

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Sidebar,
    Header,
    AddWorkerModal,
    ConfirmDelete,
  ],
  templateUrl: './workers.html',
  styleUrl: './workers.css',
})
export class Workers implements OnInit {
  private dataHandler = inject(DataHandlerService);
  private workersService = inject(WorkersService);
  private router = inject(Router);

  private _showAddWorker = signal(false);
  private _showDeleteModal = signal(false);
  private _itemToDeleteId = signal<string | number | null>(null);
  private _itemToDeleteName = signal('');
  private _sortOrder = signal<'asc' | 'desc'>('asc');
  private _workersList = signal<Worker[]>([]);
  private _searchQuery = signal('');
  private _selectedRole = signal('all');

  get showAddWorker() {
    return this._showAddWorker();
  }
  set showAddWorker(value: boolean) {
    this._showAddWorker.set(value);
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

  get workersList() {
    return this._workersList();
  }

  get searchQuery() {
    return this._searchQuery();
  }
  set searchQuery(value: string) {
    this._searchQuery.set(value);
  }

  get selectedRole() {
    return this._selectedRole();
  }
  set selectedRole(value: string) {
    this._selectedRole.set(value);
  }

  private _displayedWorkers = computed(() => {
    let result = this.dataHandler.filterArray(this._workersList(), this.searchQuery, [
      'name',
      'email',
    ]);
    if (this.selectedRole !== 'all') {
      result = this.dataHandler.filterArrayByValue(result, 'role', this.selectedRole);
    }
    return this.dataHandler.sortArray(result, 'name', this.sortOrder);
  });

  get displayedWorkers() {
    return this._displayedWorkers();
  }

  ngOnInit(): void {
    this.loadWorkers();
  }

  loadWorkers() {
    this.workersService.getWorkers().subscribe({
      next: (data) => this._workersList.set(data),
      error: (err) => console.error('Error while loading workers', err),
    });
  }

  toggleSort(): void {
    this._sortOrder.update((order) => (order === 'asc' ? 'desc' : 'asc'));
  }

  viewWorker(id: any): void {
    this.router.navigate(['/workers/details', String(id)]);
  }

  editWorker(id: any): void {
    this.router.navigate(['/workers/details', String(id)]);
  }

  changeProfile(id: any, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value;

    const stringId = String(id);

    this.workersService.updateWorker(stringId, { role: newRole }).subscribe({
      next: () => {
        this._workersList.update((list) =>
          list.map((w) => (String(w.id) === stringId ? { ...w, role: newRole } : w)),
        );
      },
      error: (err) => {
        console.error('Error while updating worker role', err);
        this.loadWorkers();
      },
    });
  }

  handleSaveWorker(newWorkerData: any) {
    this.workersService.createWorker(newWorkerData).subscribe({
      next: (createdWorker) => {
        this._workersList.update((list) => [...list, createdWorker]);
        this._showAddWorker.set(false);
      },
      error: (err) => console.error('Error while creating worker', err),
    });
  }

  openDeleteModal(worker: Worker) {
    this._itemToDeleteId.set(worker.id || null);
    this._itemToDeleteName.set(worker.name || worker.email);
    this._showDeleteModal.set(true);
  }

  handleConfirmDelete() {
    const id = this._itemToDeleteId();
    if (id) {
      this.workersService.deleteWorker(id).subscribe({
        next: () => {
          this._workersList.update((list) => list.filter((w) => w.id !== id));
          this._showDeleteModal.set(false);
          this._itemToDeleteId.set(null);
        },
        error: (err) => console.error('Error while deleting worker', err),
      });
    }
  }
}
