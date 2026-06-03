import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { DashboardMetrics } from '../../../core/class/dashboard.model';

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
  metrics: DashboardMetrics | null = null;
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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.isLoading = false;

        if (data) {
          const rawData = data as any;

          this.totalProjects = rawData.totalProjects || 0;
          this.totalWorkers = rawData.totalWorkers || 0;
          this.totalClients = rawData.totalClients || 0;
          this.projectsList = rawData.recentProjects || [];
          this.activityList = rawData.recentActivities || [];
          this.availableClients = rawData.clientsList || [];
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard', err);
        this.isLoading = false;
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
