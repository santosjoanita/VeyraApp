import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { ProjectAccessesService } from '../../../core/services/projects/project-accesses.service';
import { ProjectWorkersService } from '../../../core/services/projects/project-workers.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Header],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private accessesService = inject(ProjectAccessesService);
  private workersService = inject(ProjectWorkersService);

  projectData: any = {};
  isEditing = false;
  credentials: any[] = [];
  visiblePasswords: { [key: string]: boolean } = {};

  assignedClients: any[] = [];
  assignedTeam: any[] = [];

  showClientModal = false;
  showWorkerModal = false;
  clientSearchQuery = '';
  workerSearchQuery = '';
  filteredClients: any[] = [];
  filteredWorkers: any[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProjectData(id);
    }
  }

  loadProjectData(id: string) {
    this.projectsService.getProjectById(id).subscribe({
      next: (data) => {
        this.projectData = data;
        this.assignedClients = (data as any).clients || [];
      },
      error: (err) => console.error('Erro ao carregar projeto', err),
    });

    this.accessesService.getAccesses(id).subscribe({
      next: (data) => (this.credentials = data),
      error: (err) => console.error('Erro ao carregar acessos', err),
    });

    this.workersService.getProjectWorkers().subscribe({
      next: (data) => {
        this.assignedTeam = data.filter((w: any) => w.projectId === id);
        this.filteredWorkers = data;
      },
      error: (err) => console.error('Erro ao carregar equipa', err),
    });
  }

  startEditing() {
    this.isEditing = true;
  }
  cancelEditing() {
    this.isEditing = false;
  }
  saveChanges() {
    this.projectsService
      .updateProject(this.projectData.id, { description: this.projectData.description })
      .subscribe({
        next: () => (this.isEditing = false),
        error: (err) => console.error('Erro ao guardar alterações', err),
      });
  }

  addCredential() {
    alert('Funcionalidade de adicionar credencial em breve!');
  }
  togglePasswordVisibility(credId: string) {
    this.visiblePasswords[credId] = !this.visiblePasswords[credId];
  }

  openClientModal() {
    this.showClientModal = true;
  }
  closeClientModal() {
    this.showClientModal = false;
  }
  isClientAssigned(clientId: any): boolean {
    return this.assignedClients.some((c) => c.id === clientId);
  }
  confirmAssignClient(client: any) {
    if (!this.isClientAssigned(client.id)) {
      this.assignedClients.push(client);
    }
    this.closeClientModal();
  }
  removeClient(clientId: any) {
    this.assignedClients = this.assignedClients.filter((c) => c.id !== clientId);
  }

  openWorkerModal() {
    this.showWorkerModal = true;
  }
  closeWorkerModal() {
    this.showWorkerModal = false;
  }
  isWorkerAssigned(workerId: any): boolean {
    return this.assignedTeam.some((w) => w.userId === workerId || w.id === workerId);
  }
  confirmAssignWorker(worker: any) {
    if (this.isWorkerAssigned(worker.id)) {
      this.removeWorker(worker.id);
    } else {
      this.assignedTeam.push({
        userId: worker.id,
        name: worker.name,
        role: worker.role || 'worker',
        projectId: this.projectData.id,
      });
      this.syncTeamWithBackend();
    }
  }
  removeWorker(userId: any) {
    this.assignedTeam = this.assignedTeam.filter((w) => w.userId !== userId);
    this.syncTeamWithBackend();
  }
  private syncTeamWithBackend() {
    const workerIds = this.assignedTeam.map((w) => w.userId);
    this.projectsService.updateProject(this.projectData.id, { workers: workerIds }).subscribe();
  }
}
