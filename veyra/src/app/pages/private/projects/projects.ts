import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { AddProjectModal } from '../../../core/components/modals/add-project/add-project';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';
import { DataHandlerService } from '../../../core/services/data-handler.service';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { ClientsService } from '../../../core/services/clients/clients.service';
import { ProjectWorkersService } from '../../../core/services/projects/project-workers.service';
import { WorkersService } from '../../../core/services/workers/workers.service';
import { Paginator } from '../../../core/components/paginator/paginator';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Sidebar,
    Header,
    AddProjectModal,
    ConfirmDelete,
    Paginator,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  private dataHandler = inject(DataHandlerService);
  private projectsService = inject(ProjectsService);
  private clientsService = inject(ClientsService);
  private projectWorkersService = inject(ProjectWorkersService);
  private workersService = inject(WorkersService);
  private router = inject(Router);

  private _showAddProject = signal(false);
  private _showDeleteModal = signal(false);
  private _projectToDeleteName = signal('');
  private _projectToDeleteId = signal<string | null>(null);
  private _sortOrder = signal<'asc' | 'desc'>('asc');
  private _editingProject = signal<any | null>(null);

  private _projectsList = signal<any[]>([]);
  private _clientsList = signal<any[]>([]);
  private _workersList = signal<any[]>([]);

  private _teamsMap = signal<{ [projectId: string]: any[] }>({});

  private _searchQuery = signal('');
  private _selectedStatus = signal('all');
  private _currentPage = signal(1);
  private _pageSize = signal(10);

  get showAddProject() {
    return this._showAddProject();
  }
  set showAddProject(value: boolean) {
    this._showAddProject.set(value);
  }

  get showDeleteModal() {
    return this._showDeleteModal();
  }
  set showDeleteModal(value: boolean) {
    this._showDeleteModal.set(value);
  }

  get projectToDeleteName() {
    return this._projectToDeleteName();
  }
  set projectToDeleteName(value: string) {
    this._projectToDeleteName.set(value);
  }

  get sortOrder() {
    return this._sortOrder();
  }
  set sortOrder(value: 'asc' | 'desc') {
    this._sortOrder.set(value);
  }

  get projectsList() {
    return this._projectsList();
  }
  get clientsList() {
    return this._clientsList();
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

  get selectedStatus() {
    return this._selectedStatus();
  }
  set selectedStatus(value: string) {
    this._selectedStatus.set(value);
    this._currentPage.set(1);
  }

  get editingProject() {
    return this._editingProject();
  }

  private _filteredProjects = computed(() => {
    const rawProjects = this._projectsList();
    const clients = this._clientsList();
    const workers = this._workersList();
    const teams = this._teamsMap();

    const enrichedProjects = rawProjects.map((project) => {
      const matchedClient = clients.find((c) => c.id === project.clientId);

      const rawTeam = teams[project.id] || [];
      const assignedTeam = rawTeam.map((member: any) => {
        const fullProfile = workers.find((w) => w.id === member.userId || w.id === member.id);
        return {
          ...member,
          userId: member.userId || member.id,
          name: fullProfile ? fullProfile.name : 'User',
        };
      });

      return {
        ...project,
        clientName: matchedClient ? matchedClient.name : 'Unassigned',
        assignedTeam: assignedTeam,
      };
    });

    let result = this.dataHandler.filterArray(enrichedProjects, this.searchQuery, ['name']);
    if (this.selectedStatus !== 'all') {
      result = this.dataHandler.filterArrayByValue(result, 'status', this.selectedStatus);
    }
    return this.dataHandler.sortArray(result, 'name', this.sortOrder);
  });

  get totalProjectsCount() {
    return this._filteredProjects().length;
  }

  private _displayedProjects = computed(() => {
    const list = this._filteredProjects();
    const startIndex = (this._currentPage() - 1) * this._pageSize();
    return list.slice(startIndex, startIndex + this._pageSize());
  });

  get displayedProjects() {
    return this._displayedProjects();
  }

  editProject(project: any): void {
    this._editingProject.set(project);
    this.showAddProject = true;
  }

  ngOnInit(): void {
    this.loadWorkers();
    this.loadClients();
    this.loadProjects();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this._currentPage.set(event.pageIndex);
    this._pageSize.set(event.pageSize);
  }

  loadWorkers() {
    this.workersService.getWorkers().subscribe({
      next: (data) => this._workersList.set(data),
      error: (err) => console.error('Error while loading workers', err),
    });
  }

  loadClients() {
    this.clientsService.getClients().subscribe({
      next: (data) => this._clientsList.set(data),
      error: (err) => console.error('Error while loading clients', err),
    });
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (projects) => {
        this._projectsList.set(projects);

        projects.forEach((project: any) => {
          this.projectWorkersService.getProjectWorkers(project.id).subscribe({
            next: (teamMembers) => {
              this._teamsMap.update((map) => ({
                ...map,
                [project.id]: teamMembers,
              }));
            },
            error: (err) =>
              console.error(`Error while loading team for project ${project.id}`, err),
          });
        });
      },
      error: (err) => console.error('Error while loading projects', err),
    });
  }

  toggleSort(): void {
    this._sortOrder.update((order) => (order === 'asc' ? 'desc' : 'asc'));
  }

  viewProject(id: string): void {
    this.router.navigate(['/projects/details', id]);
  }

  handleSaveProject(data: any) {
    const projectToEdit = this._editingProject();

    if (projectToEdit) {
      this.projectsService.updateProject(projectToEdit.id, data).subscribe({
        next: () => {
          this.loadProjects();
          this.closeModal();
        },
        error: (err) => console.error('Error while updating project', err),
      });
    } else {
      this.projectsService.createProject(data).subscribe({
        next: () => {
          this.loadProjects();
          this.closeModal();
        },
        error: (err) => console.error('Error while creating project', err),
      });
    }
  }

  openDeleteModal(project: any) {
    this._projectToDeleteId.set(project.id);
    this._projectToDeleteName.set(project.name);
    this._showDeleteModal.set(true);
  }

  closeModal() {
    this.showAddProject = false;
    this._editingProject.set(null);
  }

  handleConfirmDelete() {
    const id = this._projectToDeleteId();
    if (id) {
      this.projectsService.deleteProject(id).subscribe({
        next: () => {
          this._projectsList.update((list) => list.filter((p) => p.id !== id));
          this._showDeleteModal.set(false);
          this._projectToDeleteId.set(null);
        },
        error: (err) => console.error('Error while deleting project', err),
      });
    }
  }
}
