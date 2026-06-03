import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { WorkersService } from '../../../core/services/workers/workers.service';
import { ClientsService } from '../../../core/services/clients/clients.service';
import { AddProjectModal } from '../../../core/components/modals/add-project/add-project';
import { AddWorkerModal } from '../../../core/components/modals/add-worker/add-worker';
import { AddClientModal } from '../../../core/components/modals/add-client/add-client';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';
import { DashboardMetrics } from '../../../core/class/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Header,
    AddProjectModal,
    AddWorkerModal,
    AddClientModal,
    ConfirmDelete,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private projectsService = inject(ProjectsService);
  private workersService = inject(WorkersService);
  private clientsService = inject(ClientsService);

  private _showAddProject = signal(false);
  private _showAddWorker = signal(false);
  private _showAddClient = signal(false);
  private _showDeleteModal = signal(false);
  private _projectToDeleteId = signal<string | null>(null);
  private _itemToDeleteName = signal('');

  private _projectsList = signal<any[]>([]);
  private _activityList = signal<any[]>([]);
  private _availableClients = signal<any[]>([]);

  private _totalProjects = signal(0);
  private _totalWorkers = signal(0);
  private _totalClients = signal(0);

  get showAddProject() {
    return this._showAddProject();
  }
  set showAddProject(value: boolean) {
    this._showAddProject.set(value);
  }

  get showAddWorker() {
    return this._showAddWorker();
  }
  set showAddWorker(value: boolean) {
    this._showAddWorker.set(value);
  }

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

  get projectsList() {
    return this._projectsList();
  }
  get activityList() {
    return this._activityList();
  }
  get availableClients() {
    return this._availableClients();
  }

  get totalProjects() {
    return this._totalProjects();
  }
  get totalWorkers() {
    return this._totalWorkers();
  }
  get totalClients() {
    return this._totalClients();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getMetrics().subscribe({
      next: (data: DashboardMetrics) => {
        if (data) {
          this._totalProjects.set(data.projects?.total || 0);
          this._totalWorkers.set(data.workers?.total || 0);
          this._totalClients.set(data.clients?.total || 0);

          this._activityList.set([]);
        }
      },
      error: (err) => console.error('Error while loading dashboard metrics', err),
    });

    this.projectsService.getProjects().subscribe({
      next: (data) => this._projectsList.set(data),
      error: (err) => console.error('Error while loading projects list', err),
    });

    this.clientsService.getClients().subscribe({
      next: (data) => this._availableClients.set(data),
      error: (err) => console.error('Error while loading available clients', err),
    });
  }

  deleteProject(id: string) {
    const project = this._projectsList().find((p) => p.id === id);
    if (project) {
      this._projectToDeleteId.set(id);
      this._itemToDeleteName.set(project.name);
      this._showDeleteModal.set(true);
    }
  }

  handleConfirmDelete() {
    const id = this._projectToDeleteId();
    if (id) {
      this.projectsService.deleteProject(id).subscribe({
        next: () => {
          this._projectsList.update((list) => list.filter((p) => p.id !== id));
          this._showDeleteModal.set(false);
          this._projectToDeleteId.set(null);
          this._totalProjects.update((count) => (count > 0 ? count - 1 : 0));
        },
        error: (err) => console.error('Error while deleting project', err),
      });
    }
  }

  handleSaveProject(newProjectData: any) {
    this.projectsService.createProject(newProjectData).subscribe({
      next: (createdProject) => {
        this._projectsList.update((list) => [...list, createdProject]);
        this._totalProjects.update((count) => count + 1);
        this._showAddProject.set(false);
      },
      error: (err) => console.error('Error while creating project', err),
    });
  }

  handleSaveWorker(newWorkerData: any) {
    this.workersService.createWorker(newWorkerData).subscribe({
      next: () => {
        this._totalWorkers.update((count) => count + 1);
        this._showAddWorker.set(false);
      },
      error: (err) => console.error('Error while creating worker', err),
    });
  }

  handleSaveClient(newClientData: any) {
    this.clientsService.createClient(newClientData).subscribe({
      next: (createdClient) => {
        this._availableClients.update((list) => [...list, createdClient]);
        this._totalClients.update((count) => count + 1);
        this._showAddClient.set(false);
      },
      error: (err) => console.error('Error while creating client', err),
    });
  }
}
