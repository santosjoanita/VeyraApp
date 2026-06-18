import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { AddWorkerModal } from '../../../core/components/modals/add-worker/add-worker';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';
import { ConfirmModal } from '../../../core/components/modals/confirm-modal/confirm-modal';
import { DataHandlerService } from '../../../core/services/data-handler.service';
import { WorkersService } from '../../../core/services/workers/workers.service';
import { Worker } from '../../../core/class/worker.model';
import { Paginator } from '../../../core/components/paginator/paginator';

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
    ConfirmModal,
    Paginator,
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
  private _showRoleModal = signal(false);
  private _itemToDeleteId = signal<string | number | null>(null);
  private _itemToDeleteName = signal('');
  private _sortOrder = signal<'asc' | 'desc'>('asc');
  private _workersList = signal<Worker[]>([]);
  private _searchQuery = signal('');
  private _selectedRole = signal('all');
  private _currentPage = signal(1);
  private _pageSize = signal(10);

  pendingRoleChange = signal<{
    id: string | number;
    name: string;
    oldRole: string;
    newRole: string;
    selectElement: HTMLSelectElement;
  } | null>(null);

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

  get showRoleModal() {
    return this._showRoleModal();
  }
  set showRoleModal(value: boolean) {
    this._showRoleModal.set(value);
  }

  get itemToDeleteName() {
    return this._itemToDeleteName();
  }
  set itemToDeleteName(value: string) {
    this._itemToDeleteName.set(value);
  }
  get currentPage() {
    return this._currentPage();
  }

  get pageSize() {
    return this._pageSize();
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
    this._currentPage.set(1);
  }

  get selectedRole() {
    return this._selectedRole();
    this._currentPage.set(1);
  }
  set selectedRole(value: string) {
    this._selectedRole.set(value);
  }
  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  private _filteredWorkers = computed(() => {
    let result = this.dataHandler.filterArray(this._workersList(), this.searchQuery, [
      'name',
      'email',
    ]);
    if (this.selectedRole !== 'all') {
      result = this.dataHandler.filterArrayByValue(result, 'role', this.selectedRole);
    }
    return this.dataHandler.sortArray(result, 'name', this.sortOrder);
  });

  get totalWorkersCount() {
    return this._filteredWorkers().length;
  }

  private _displayedWorkers = computed(() => {
    const list = this._filteredWorkers();
    const startIndex = (this._currentPage() - 1) * this._pageSize();
    return list.slice(startIndex, startIndex + this._pageSize());
  });

  get displayedWorkers() {
    return this._displayedWorkers();
  }

  ngOnInit(): void {
    this.loadWorkers();
    this.workersService.refresh.subscribe(() => {
      this.loadWorkers();
    });
  }

  loadWorkers() {
    this.workersService.getWorkers().subscribe({
      next: (data) => {
        const normalizedWorkers = data.map((worker) => {
          const isActiveValue = (worker as any).isActive;
          const lastAccessValue =
            worker.lastAccess ??
            (worker as any).last_access ??
            (worker as any).lastLogin ??
            (worker as any).last_login;

          return {
            ...worker,
            status:
              worker.status ??
              (typeof isActiveValue === 'boolean'
                ? isActiveValue
                  ? 'active'
                  : 'inactive'
                : undefined),
            lastAccess: lastAccessValue,
          };
        });
        this._workersList.set(normalizedWorkers);
      },
      error: (err) => console.error('Error loading workers', err),
    });
  }
  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this._currentPage.set(event.pageIndex);
    this._pageSize.set(event.pageSize);
  }

  toggleSort(): void {
    this._sortOrder.update((order) => (order === 'asc' ? 'desc' : 'asc'));
  }

  trackByWorkerId(index: number, worker: Worker) {
    return worker.id;
  }

  viewWorker(id: string | number): void {
    this.router.navigate(['/workers/details', id]);
  }

  editWorker(id: string | number): void {
    this.router.navigate(['/workers/details', id]);
  }

  changeProfile(id: string | number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value;

    const worker = this._workersList().find((w) => w.id === id);
    if (!worker) return;

    const oldRole = worker.role;

    if (oldRole === newRole) return;

    this.pendingRoleChange.set({
      id,
      name: worker.name || worker.email,
      oldRole: oldRole,
      newRole: newRole,
      selectElement: selectElement,
    });
    this.showRoleModal = true;
  }

  confirmRoleChange() {
    const pending = this.pendingRoleChange();
    if (!pending) return;

    const rolePayload = { role: pending.newRole };

    this.workersService.updateWorker(pending.id, rolePayload).subscribe({
      next: () => {
        this._workersList.update((list) =>
          list.map((w) => (w.id === pending.id ? { ...w, role: pending.newRole } : w)),
        );
        this.closeRoleModal();
      },
      error: (err) => {
        console.error('Erro while updating workers role', err);
        pending.selectElement.value = pending.oldRole;
        this.closeRoleModal();
      },
    });
  }

  cancelRoleChange() {
    const pending = this.pendingRoleChange();
    if (pending) {
      pending.selectElement.value = pending.oldRole;
    }
    this.closeRoleModal();
  }

  private closeRoleModal() {
    this.showRoleModal = false;
    this.pendingRoleChange.set(null);
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
