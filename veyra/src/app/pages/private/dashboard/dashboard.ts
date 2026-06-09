import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { AuthService } from '../../../core/services/user/auth.service';
import { ClientsService } from '../../../core/services/clients/clients.service';
import { ProjectsService } from '../../../core/services/projects/projects.service';

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

  metrics: any = null;
  isLoading = true;

  showAddProject = false;
  showAddWorker = false;
  showAddClient = false;
  showDeleteModal = false;
  itemToDeleteName = '';

  totalProjects = 0;
  totalWorkers = 0;
  totalClients = 0;
  projectsList: any[] = [];
  activityList: any[] = [];
  availableClients: any[] = [];
  currentUser = { name: localStorage.getItem('userName') || 'User' };

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

  loadDashboardData() {
    this.isLoading = true;

    // 1. Carrega as métricas puras (apenas para alimentar os contadores e o log de atividades)
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
        console.error('Error while loading dashboard metrics:', err);
        this.cdr.detectChanges();
      },
    });

    this.projectsService.getProjects().subscribe({
      next: (realProjects: any[]) => {
        const limitedProjects = realProjects.slice(0, 5);

        this.clientsService.getClients().subscribe({
          next: (realClients) => {
            this.availableClients = realClients;

            this.projectsList = limitedProjects.map((project: any) => {
              const matchedClient = realClients.find((c) => c.id === project.clientId);
              return {
                ...project,
                client: matchedClient,
              };
            });

            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error while loading clients for dashboard:', err);
            this.projectsList = limitedProjects;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => {
        console.error('Error while loading projects for dashboard:', err);
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

  deleteProject(id: any) {
    this.showDeleteModal = true;
    this.itemToDeleteName = 'Este Projeto';
  }

  handleConfirmDelete() {
    this.showDeleteModal = false;
  }
}
