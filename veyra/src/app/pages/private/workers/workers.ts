import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  showAddWorker = false;
  showDeleteModal = false;
  itemToDeleteId: string | number | null = null;
  itemToDeleteName: string = '';

  searchQuery: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  selectedRole: string = 'all';

  workersList: Worker[] = [];

  constructor(
    private dataHandler: DataHandlerService,
    private workersService: WorkersService,
  ) {}

  ngOnInit(): void {
    this.loadWorkers();
  }

  loadWorkers() {
    this.workersService.getWorkers().subscribe({
      next: (data) => (this.workersList = data),
      error: (err) => console.error('Erro ao carregar workers', err),
    });
  }

  get displayedWorkers(): Worker[] {
    let result = this.dataHandler.filterArray(this.workersList, this.searchQuery, [
      'name',
      'email',
    ]);
    if (this.selectedRole !== 'all') {
      result = this.dataHandler.filterArrayByValue(result, 'role', this.selectedRole);
    }
    return this.dataHandler.sortArray(result, 'name', this.sortOrder);
  }

  toggleSort(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  handleSaveWorker(newWorkerData: any) {
    this.workersService.createWorker(newWorkerData).subscribe({
      next: (createdWorker) => {
        this.workersList.push(createdWorker);
        this.showAddWorker = false;
      },
      error: (err) => console.error('Erro ao criar worker', err),
    });
  }

  openDeleteModal(worker: Worker) {
    this.itemToDeleteId = worker.id;
    this.itemToDeleteName = worker.name || worker.email;
    this.showDeleteModal = true;
  }

  handleConfirmDelete() {
    if (this.itemToDeleteId) {
      this.workersService.deleteWorker(this.itemToDeleteId).subscribe({
        next: () => {
          this.workersList = this.workersList.filter((w) => w.id !== this.itemToDeleteId);
          this.showDeleteModal = false;
          this.itemToDeleteId = null;
        },
        error: (err) => console.error('Erro ao apagar worker', err),
      });
    }
  }
}
