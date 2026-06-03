import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { AuthService } from '../../../core/services/user/auth.service';

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
  private cdr = inject(ChangeDetectorRef);

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
        console.error('Erro ao ir buscar o nome para a dashboard', err);
        this.cdr.detectChanges();
      },
    });

    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        this.isLoading = false;
        console.log('dashboard responses', data);

        if (data) {
          this.metrics = data;
          const rawData = data as any;

          this.totalProjects = rawData.projects?.total || 0;
          this.totalWorkers = rawData.workers?.total || 0;
          this.totalClients = rawData.clients?.total || 0;

          this.metrics.totalProjects = this.totalProjects;
          this.metrics.totalWorkers = this.totalWorkers;
          this.metrics.totalClients = this.totalClients;

          this.projectsList = rawData.projectsList || rawData.recentProjects || [];
          this.activityList = rawData.activityList || rawData.recentActivities || [];
          this.availableClients = rawData.clientsList || [];
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error while loading dashboard', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  handleSaveProject(event: any) {
    this.showAddProject = false;
  }
  handleSaveWorker(event: any) {
    this.showAddWorker = false;
  }
  handleSaveClient(event: any) {
    this.showAddClient = false;
  }

  deleteProject(id: any) {
    this.showDeleteModal = true;
    this.itemToDeleteName = 'Este Projeto';
  }

  handleConfirmDelete() {
    this.showDeleteModal = false;
  }
}
