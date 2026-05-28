import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';
import { AddWorkerModal } from '../../../core/components/modals/add-worker/add-worker';
import { AddClientModal } from '../../../core/components/modals/add-client/add-client';
import { AddProjectModal } from '../../../core/components/modals/add-project/add-project';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';

export interface Project {
  id: number;
  clientId: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface Activity {
  id: number;
  user?: string; 
  action: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, Header, AddProjectModal, AddClientModal, AddWorkerModal, RouterModule, ConfirmDelete],  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css' 
})
export class Dashboard {
  totalProjects: number = 5;
  totalWorkers: number = 4;
  totalClients: number = 12;

  showAddClient = false;
  showAddWorker = false;
  showAddProject = false;
  showDeleteModal = false;
  itemToDeleteId: number | null = null;
  itemToDeleteName: string = '';

  availableClients = [
    { id: 'c1', name: 'Acme Corp' },
    { id: 'c2', name: 'Global Industries' }
  ];

  projectsList: Project[] = [
    { 
      id: 1, 
      clientId: 'C001',
      name: 'Veyra Dashboard Redesign', 
      description: 'Complete UI overhaul',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2026-05-25' 
    },
    { 
      id: 2, 
      clientId: 'C002',
      name: 'Brandit Mobile App', 
      description: 'iOS and Android app development',
      status: 'active',
      startDate: '2025-02-15',
      endDate: '2026-06-10' 
    },
    { 
      id: 3, 
      clientId: 'C003',
      name: 'Client Portal API', 
      description: 'Backend integration',
      status: 'active',
      startDate: '2025-03-01',
      endDate: '2026-07-14' 
    }
  ];

  activityList: Activity[] = [
    { id: 1, user: 'Dexter Morgan', action: 'logged in', time: 'Just now' },
    { id: 2, user: 'Admin', action: 'created "Client Portal API"', time: '2 hours ago' },
    { id: 3, action: 'Project "Old Website" was deleted', time: 'Yesterday' }
  ];

 deleteProject(id: number): void {
    const project = this.projectsList.find(p => p.id === id);
    if(project){
      this.itemToDeleteId = id;
      this.itemToDeleteName = project.name;
      this.showDeleteModal = true;
    }
  }

  handleConfirmDelete(): void {
    if(this.itemToDeleteId !== null){
      this.projectsList = this.projectsList.filter(p => p.id !== this.itemToDeleteId);
    }
    this.showDeleteModal = false;
    this.itemToDeleteId = null;
  }

  handleSaveClient(data: any) {
    console.log('Novo Cliente do Dashboard:', data);
    this.showAddClient = false;
  }

  handleSaveWorker(data: any) {
    console.log('Novo Worker do Dashboard:', data);
    this.showAddWorker = false;
  }

  handleSaveProject(data: any) {
    console.log('Novo Projeto do Dashboard:', data);
    this.showAddProject = false;
  }
}