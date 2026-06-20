import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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

import { MessageService } from 'primeng/api';

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
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  private _showAddProject = signal(false);
  private _showDeleteModal = signal(false);
  private _projectToDeleteName = signal('');
  private _projectToDeleteId = signal<string | null>(null);
  private _editingProject = signal<any | null>(null);

  private _projectsList = signal<any[]>([]);
  private _clientsList = signal<any[]>([]);
  private _workersList = signal<any[]>([]);

  private _teamsMap = signal<{ [projectId: string]: any[] }>({});

  private _searchQuery = signal('');
  private _selectedStatus = signal('all');
  private _currentPage = signal(1);
  private _pageSize = signal(5); // Mantém-se o 5 para consistência!

  // 🔥 Signals de ordenação dinâmicos integrados
  sortField = signal<string>('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');

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

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
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
      let clientNames = 'Unassigned';

      if (Array.isArray(project.clients)) {
        const names = project.clients
          .map((client: any) => {
            if (client && typeof client === 'object' && client.id != null) {
              return client.name;
            }
            const matched = clients.find((c) => c.id === client);
            return matched ? matched.name : null;
          })
          .filter(Boolean);

        if (names.length) {
          clientNames = names.join(', ');
        }
      }

      if (clientNames === 'Unassigned' && project.clientId) {
        const matchedClient = clients.find((c) => c.id === project.clientId);
        clientNames = matchedClient ? matchedClient.name : 'Unassigned';
      }

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
        clientName: clientNames,
        assignedTeam,
      };
    });

    let result = this.dataHandler.filterArray(enrichedProjects, this.searchQuery, ['name']);
    if (this.selectedStatus !== 'all') {
      result = this.dataHandler.filterArrayByValue(result, 'status', this.selectedStatus);
    }
    // 🔥 Agora usa o sortField dinâmico
    return this.dataHandler.sortArray(result, this.sortField(), this.sortOrder());
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

    this.loadWorkers();
    this.loadClients();
    this.loadProjects();
  }

  editProject(project: any): void {
    this._editingProject.set(project);
    this.showAddProject = true;
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

  // 🔥 Nova função de ordenação pronta para o HTML
  toggleSort(field: string): void {
    if (this.sortField() === field) {
      this.sortOrder.update((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortOrder.set('asc');
    }
  }

  loadWorkers() {
    // 🔥 BLOQUEIO DE SEGURANÇA: Só os admins podem carregar a lista completa de workers!
    if (!this.isAdmin) {
      return;
    }

    this.workersService.getWorkers().subscribe({
      next: (data) => this._workersList.set(data),
      error: (err) => {
        console.error('Error while loading workers', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load workers.',
        });
      },
    });
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (projects) => {
        const currentUserId = localStorage.getItem('userId');

        let projectsToKeep = projects;

        this._projectsList.set(projectsToKeep);

        projectsToKeep.forEach((project: any) => {
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
      error: (err) => {
        console.error('Error while loading projects', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load projects.',
        });
      },
    });
  }

  loadClients() {
    this.clientsService.getClients().subscribe({
      next: (data) => this._clientsList.set(data),
      error: (err) => {
        console.error('Error while loading clients', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load clients.',
        });
      },
    });
  }

  viewProject(id: string): void {
    this.router.navigate(['/projects/details', id]);
  }

  handleSaveProject(data: any) {
    const projectToEdit = this._editingProject();

    if (projectToEdit) {
      const payload = { ...data };

      delete payload.clientId;
      delete payload.id;
      delete payload.client;

      this.projectsService.updateProject(projectToEdit.id, payload).subscribe({
        next: () => {
          this.loadProjects();
          this.closeModal();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Project updated successfully.',
          });
        },
        error: (err) => {
          console.error('Error while updating project', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update project.',
          });
        },
      });
    } else {
      this.projectsService.createProject(data).subscribe({
        next: () => {
          this.loadProjects();
          this.closeModal();

          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Project created successfully.',
          });
        },
        error: (err) => {
          console.error('Error while creating project', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create project.',
          });
        },
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

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Project deleted successfully.',
          });
        },
        error: (err) => {
          console.error('Error while deleting project', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete project.',
          });
        },
      });
    }
  }
}
