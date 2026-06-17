import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { ProjectAccessesService } from '../../../core/services/projects/project-accesses.service';
import { ProjectWorkersService } from '../../../core/services/projects/project-workers.service';
import { WorkersService } from '../../../core/services/workers/workers.service';
import { ClientsService } from '../../../core/services/clients/clients.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Header],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.css', '../../../../assets/themes/variables.css'],
})
export class ProjectDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private accessesService = inject(ProjectAccessesService);
  private workersService = inject(ProjectWorkersService);
  private cdr = inject(ChangeDetectorRef);
  private generalWorkersService = inject(WorkersService);
  private clientsService = inject(ClientsService);

  projectData: any = {};
  isEditing = false;
  credentials: any[] = [];
  visiblePasswords: { [key: string]: boolean } = {};

  assignedClients: any[] = [];
  assignedTeam: any[] = [];

  showClientModal = false;
  showWorkerModal = false;
  showCredentialModal = false;

  clientSearchQuery = '';
  workerSearchQuery = '';
  filteredClients: any[] = [];
  filteredWorkers: any[] = [];

  newCredentialData = {
    label: '',
    type: 'cpanel',
    username: '',
    password: '',
  };

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProjectData(id);
    }
  }

  loadProjectData(id: string) {
    this.projectsService.getProjectById(id).subscribe({
      next: (data: any) => {
        this.projectData = data;
        this.initializeAssignedClients(data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error while loading project', err);
        this.cdr.detectChanges();
      },
    });

    this.clientsService.getClients().subscribe({
      next: (allClients) => {
        this.filteredClients = allClients;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error while loading clients list', err),
    });

    this.accessesService.getAccesses(id).subscribe({
      next: (data) => {
        this.credentials = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error while loading accesses', err);
        this.cdr.detectChanges();
      },
    });

    this.generalWorkersService.getWorkers().subscribe({
      next: (allWorkers) => {
        this.filteredWorkers = allWorkers;

        this.workersService.getProjectWorkers(id).subscribe({
          next: (teamData: any[]) => {
            this.assignedTeam = teamData.map((assignment) => {
              const fullProfile = allWorkers.find(
                (w) => w.id === assignment.userId || w.id === assignment.id,
              );
              return {
                ...assignment,
                userId: assignment.userId || assignment.id,
                name: fullProfile ? fullProfile.name : 'Unknown Worker',
                role: fullProfile ? fullProfile.role : 'worker',
                email: fullProfile ? fullProfile.email : '',
              };
            });
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error while loading team', err);
            this.assignedTeam = [];
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => console.error('Error while loading workers list', err),
    });
  }

  startEditing() {
    this.isEditing = true;
    this.cdr.detectChanges();
  }

  cancelEditing() {
    this.isEditing = false;
    this.cdr.detectChanges();
  }

  saveChanges() {
    this.projectsService
      .updateProject(this.projectData.id, { description: this.projectData.description })
      .subscribe({
        next: () => {
          this.isEditing = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error while saving changes', err);
          this.cdr.detectChanges();
        },
      });
  }

  private initializeAssignedClients(data: any) {
    if (data.client) {
      this.assignedClients = [data.client];
      return;
    }

    if (data.clientId) {
      this.clientsService.getClients().subscribe((allClients) => {
        const foundClient = allClients.find((c) => c.id === data.clientId);
        this.assignedClients = foundClient ? [foundClient] : [];
        this.cdr.detectChanges();
      });
      return;
    }

    this.assignedClients = [];
  }

  openCredentialModal() {
    this.newCredentialData = {
      label: '',
      type: 'cpanel',
      username: '',
      password: '',
    };
    this.showCredentialModal = true;
    this.cdr.detectChanges();
  }

  closeCredentialModal() {
    this.showCredentialModal = false;
    this.cdr.detectChanges();
  }

  addCredential() {
    if (
      !this.newCredentialData.label ||
      !this.newCredentialData.username ||
      !this.newCredentialData.password
    ) {
      alert('Please fill in all the fields.');
      return;
    }

    const credentialPayload = {
      projectId: this.projectData.id,
      type: this.newCredentialData.type,
      label: this.newCredentialData.label,
      data: {
        username: this.newCredentialData.username,
        password: this.newCredentialData.password,
      },
    };

    this.accessesService.createAccess(credentialPayload).subscribe({
      next: (newCredential) => {
        this.credentials.push(newCredential);
        this.closeCredentialModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating project credential:', err);
        alert('Failed to save credential.');
      },
    });
  }

  togglePasswordVisibility(credId: string) {
    this.visiblePasswords[credId] = !this.visiblePasswords[credId];
    this.cdr.detectChanges();
  }

  openClientModal() {
    this.showClientModal = true;
    this.cdr.detectChanges();
  }

  closeClientModal() {
    this.showClientModal = false;
    this.cdr.detectChanges();
  }

  isClientAssigned(clientId: any): boolean {
    return this.assignedClients.some((c) => c.id === clientId);
  }

  confirmAssignClient(client: any) {
    if (!this.isClientAssigned(client.id)) {
      this.assignedClients = [client];
      this.syncClientsWithBackend();
    }
    this.closeClientModal();
  }

  removeClient(clientId: any) {
    this.assignedClients = this.assignedClients.filter((c) => c.id !== clientId);
    this.syncClientsWithBackend();
  }

  private syncClientsWithBackend() {
    const clientId = this.assignedClients.length > 0 ? this.assignedClients[0].id : undefined;
    this.projectData.clientId = clientId;

    this.projectsService
      .updateProject(this.projectData.id, {
        clientId: clientId,
      })
      .subscribe({
        next: () => this.cdr.detectChanges(),
        error: () => this.cdr.detectChanges(),
      });
  }

  openWorkerModal() {
    this.showWorkerModal = true;
    this.cdr.detectChanges();
  }

  closeWorkerModal() {
    this.showWorkerModal = false;
    this.cdr.detectChanges();
  }

  isWorkerAssigned(workerId: any): boolean {
    return this.assignedTeam.some((w) => w.userId === workerId || w.id === workerId);
  }

  confirmAssignWorker(worker: any) {
    if (this.isWorkerAssigned(worker.id)) {
      this.removeWorker(worker.id);
    } else {
      this.workersService.assignWorker(this.projectData.id, worker.id).subscribe({
        next: () => {
          this.assignedTeam.push({
            userId: worker.id,
            name: worker.name,
            role: worker.role || 'user',
          });
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error while assigning worker:', err),
      });
    }
    this.closeWorkerModal();
  }

  removeWorker(userId: any) {
    this.workersService.removeWorker(this.projectData.id, userId).subscribe({
      next: () => {
        this.assignedTeam = this.assignedTeam.filter((w) => w.userId !== userId);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error while removing worker:', err),
    });
  }
}
