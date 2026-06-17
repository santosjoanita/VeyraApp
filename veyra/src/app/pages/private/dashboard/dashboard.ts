import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { AuthService } from '../../../core/services/user/auth.service';
import { ClientsService } from '../../../core/services/clients/clients.service';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { ProjectWorkersService } from '../../../core/services/projects/project-workers.service';
import { PreferencesService } from '../../../core/services/preferences.service';

import { AddProjectModal } from '../../../core/components/modals/add-project/add-project';
import { AddWorkerModal } from '../../../core/components/modals/add-worker/add-worker';
import { AddClientModal } from '../../../core/components/modals/add-client/add-client';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';

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
  private authService = inject(AuthService);
  private clientsService = inject(ClientsService);
  private cdr = inject(ChangeDetectorRef);
  private projectsService = inject(ProjectsService);
  private projectWorkersService = inject(ProjectWorkersService);
  private preferencesService = inject(PreferencesService);

  metrics: any = null;
  isLoading = true;

  showAddProject = false;
  showAddWorker = false;
  showAddClient = false;
  showDeleteModal = false;

  projectToDeleteId: any = null;
  itemToDeleteName = '';

  totalProjects = 0;
  totalWorkers = 0;
  totalClients = 0;
  projectsList: any[] = [];
  activityList: any[] = [];
  availableClients: any[] = [];
  currentUser: any = { name: localStorage.getItem('userName') || 'User' };

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (userData) => {
        if (userData) {
          const actualUser = userData.user || userData;
          this.currentUser = actualUser;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching user for dashboard', err);
        this.cdr.detectChanges();
      },
    });

    this.loadDashboardData();
  }

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  get showActivityLog() {
    return this.preferencesService.showActivityLog;
  }

  loadDashboardData() {
    this.isLoading = true;

    this.dashboardService.getMetrics().subscribe({
      next: (data: any) => {
        if (data) {
          this.metrics = data;
          this.totalProjects = data.projects?.total || 0;
          this.totalWorkers = data.workers?.total || 0;
          this.totalClients = data.clients?.total || 0;
          this.activityList = data.activityList || data.recentActivities || [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error while loading dashboard metrics', err);
        this.cdr.detectChanges();
      },
    });

    this.projectsService.getProjects().subscribe({
      next: (realProjects: any[]) => {
        this.clientsService.getClients().subscribe({
          next: (realClients) => {
            this.availableClients = realClients;

            const mappedProjects = realProjects.map((project: any) => {
              const matchedClient = realClients.find((c) => c.id === project.clientId);
              return { ...project, client: matchedClient };
            });

            if (this.isAdmin) {
              this.projectsList = mappedProjects.slice(0, 5);
              this.isLoading = false;
              this.cdr.detectChanges();
            } else {
              const currentUserId = this.currentUser?.id || localStorage.getItem('userId');
              const workerProjects: any[] = [];
              let completedRequests = 0;

              if (mappedProjects.length === 0) {
                this.projectsList = [];
                this.isLoading = false;
                this.cdr.detectChanges();
                return;
              }

              mappedProjects.forEach((project) => {
                this.projectWorkersService.getProjectWorkers(project.id).subscribe({
                  next: (workers: any[]) => {
                    const isAssigned = workers.some(
                      (w) => w.userId === currentUserId || w.id === currentUserId,
                    );
                    if (isAssigned) {
                      workerProjects.push(project);
                    }
                    completedRequests++;
                    if (completedRequests === mappedProjects.length) {
                      this.projectsList = workerProjects.slice(0, 5);
                      this.isLoading = false;
                      this.cdr.detectChanges();
                    }
                  },
                  error: (err) => {
                    console.error('Error while loading project workers', err);
                    completedRequests++;
                    if (completedRequests === mappedProjects.length) {
                      this.projectsList = workerProjects.slice(0, 5);
                      this.isLoading = false;
                      this.cdr.detectChanges();
                    }
                  },
                });
              });
            }
          },
          error: (err) => {
            console.error('Error while loading clients for dashboard', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => {
        console.error('Error while loading projects for dashboard', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  handleSaveProject(event: any) {
    this.projectsService.createProject(event).subscribe({
      next: () => {
        this.showAddProject = false;
        this.loadDashboardData();
      },
      error: (err) => {
        console.error('Error while creating project from dashboard', err);
        alert('It seems there was an error creating the project. Please try again.');
        this.showAddProject = false;
      },
    });
  }

  handleSaveWorker(event: any) {
    this.showAddWorker = false;
    this.loadDashboardData();
  }

  handleSaveClient(event: any) {
    this.clientsService.createClient(event).subscribe({
      next: () => {
        this.showAddClient = false;
        this.loadDashboardData();
      },
      error: (err) => {
        console.error('Error saving client from dashboard:', err);
        this.showAddClient = false;
      },
    });
  }

  deleteProject(id: any, name: string = 'this project') {
    this.projectToDeleteId = id;
    this.itemToDeleteName = name;
    this.showDeleteModal = true;
  }

  handleConfirmDelete() {
    if (this.projectToDeleteId) {
      this.projectsList = this.projectsList.filter((item) => item.id !== this.projectToDeleteId);

      this.projectsService
        .deleteProject(this.projectToDeleteId)
        .subscribe(() => this.loadDashboardData());
    }
    this.showDeleteModal = false;
    this.projectToDeleteId = null;
    this.cdr.detectChanges();
  }
}
