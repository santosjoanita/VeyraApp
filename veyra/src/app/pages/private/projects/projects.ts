import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';
import { AddProjectModal } from '../../../core/components/modals/add-project/add-project';

export interface Project {
  id: string;
  name: string;
  clientId: string; 
  clientName: string; 
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate: string; 
  description?: string;
  createdAt: string;
  updatedAt: string;
  assignedTeam: { userId: string, name: string }[]; 
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header, AddProjectModal],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {
  showAddProject = false;

  clientsList = [
    { id: 'c1', name: 'Acme Corp' },
    { id: 'c2', name: 'Global Industries' },
    { id: 'c3', name: 'TechFlow Solutions' }
  ];

  projectsList: Project[] = [
    {
      id: 'p1',
      name: 'Veyra Dashboard Redesign',
      clientId: 'c1',
      clientName: 'Acme Corp',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-02-20T14:30:00Z',
      assignedTeam: [
        { userId: 'w1', name: 'Dexter Morgan' },
        { userId: 'w2', name: 'Debra Morgan' }
      ]
    },
    {
      id: 'p2',
      name: 'Brandit Mobile App',
      clientId: 'c2',
      clientName: 'Global Industries',
      status: 'completed',
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      createdAt: '2024-05-15T09:00:00Z',
      updatedAt: '2025-01-10T11:00:00Z',
      assignedTeam: [
        { userId: 'w1', name: 'Dexter Morgan' }
      ]
    },
    {
      id: 'p3',
      name: 'Client Portal API',
      clientId: 'c3',
      clientName: 'TechFlow Solutions',
      status: 'paused',
      startDate: '2025-03-01',
      endDate: '2025-08-15',
      createdAt: '2025-02-10T09:15:00Z',
      updatedAt: '2025-03-20T16:45:00Z',
      assignedTeam: [
        { userId: 'w3', name: 'Angel Batista' },
        { userId: 'w4', name: 'Vince Masuka' },
        { userId: 'w2', name: 'Debra Morgan' }
      ]
    }
  ];
handleSaveProject(newProjectData: any) {
    console.log('Fazer POST /projects com:', newProjectData);
    
    const foundClientName = this.clientsList.find(c => c.id === newProjectData.clientId)?.name || 'Unknown Client';

    this.projectsList.push({
      id: 'p_new_' + Math.random().toString(36).substr(2, 9), 
      name: newProjectData.name,
      clientId: newProjectData.clientId,
      clientName: foundClientName,
      status: newProjectData.status,
      startDate: newProjectData.startDate,
      endDate: newProjectData.endDate,
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(), 
      description: newProjectData.description,
      assignedTeam: []
    });
    
    this.showAddProject = false;
  }

  viewProject(id: string): void {
    console.log('View project ID:', id);
  }

  editProject(id: string): void {
    console.log('Edit project ID:', id);
  }

  deleteProject(id: string): void {
    console.log('Delete project ID:', id);
  }
  
}
