import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, signal, computed, inject } from '@angular/core';
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
import { ClientsService } from '../../../core/services/clients/clients.service';
import { WorkersService } from '../../../core/services/workers/workers.service';

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
  clientSearchQuery = '';
  workerSearchQuery = '';
  filteredClients: any[] = [];
  filteredWorkers: any[] = [];

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private accessesService = inject(ProjectAccessesService);
  private projectWorkersService = inject(ProjectWorkersService);
  private clientsService = inject(ClientsService);
  private workersService = inject(WorkersService);

  private _projectData = signal<any>({
    name: '',
    status: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  private _credentials = signal<any[]>([]);
  private _assignedClients = signal<any[]>([]);
  private _assignedTeam = signal<any[]>([]);

  private _showClientModal = signal(false);
  private _showWorkerModal = signal(false);
  private _isEditing = signal(false);

  private _clientSearchQuery = signal('');
  private _workerSearchQuery = signal('');

  private allClients = signal<any[]>([]);
  private allWorkers = signal<any[]>([]);

  visiblePasswords: { [key: string]: boolean } = {};
  private backupDescription = '';

  get projectData() {
    return this._projectData();
  }
  set projectData(value: any) {
    this._projectData.set(value);
  }

  get credentials() {
    return this._credentials();
  }
  get assignedClients() {
    return this._assignedClients();
  }
  get assignedTeam() {
    return this._assignedTeam();
  }

  get showClientModal() {
    return this._showClientModal();
  }
  get showWorkerModal() {
    return this._showWorkerModal();
  }
  get isEditing() {
    return this._isEditing();
  }

  get clientSearchQuery() {
    return this._clientSearchQuery();
  }
  set clientSearchQuery(value: string) {
    this._clientSearchQuery.set(value);
  }

  get workerSearchQuery() {
    return this._workerSearchQuery();
  }
  set workerSearchQuery(value: string) {
    this._workerSearchQuery.set(value);
  }

  private _filteredClients = computed(() => {
    const query = this.clientSearchQuery.toLowerCase();
    return this.allClients().filter((c) => c.name?.toLowerCase().includes(query));
  });
  get filteredClients() {
    return this._filteredClients();
  }

  private _filteredWorkers = computed(() => {
    const query = this.workerSearchQuery.toLowerCase();
    return this.allWorkers().filter((w) => w.name?.toLowerCase().includes(query));
  });
  get filteredWorkers() {
    return this._filteredWorkers();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAllData(id);
    }
  }

  loadAllData(id: string) {
    this.projectsService.getProjectById(id).subscribe({
      next: (data: any) => {
        this.projectData = data;

        if (data.client) {
          this.assignedClients = [data.client];
        } else if (data.clients && Array.isArray(data.clients)) {
          this.assignedClients = data.clients;
        } else if (data.clientId) {
          this.clientsService.getClients().subscribe((allClients) => {
            const foundClient = allClients.find((c) => c.id === data.clientId);
            this.assignedClients = foundClient ? [foundClient] : [];
            this.cdr.detectChanges();
          });
        } else {
          this.assignedClients = [];
        }

        this.cdr.detectChanges();
      next: (data) => {
        this._projectData.set(data);
        this.backupDescription = data.description || '';
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
      error: (err) => console.error('Error loading project', err),
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
      next: (data) => this._credentials.set(data),
      error: (err) => console.error('Error loading technical accesses', err),
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
    this.projectWorkersService.getProjectWorkers().subscribe({
      next: (data) => {
        this._assignedTeam.set(data.filter((w: any) => w.projectId === id));
      },
      error: (err) => console.error('Error loading allocated team', err),
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

  addCredential() {
    const label = prompt('Enter credential label (e.g., CPanel Production):');
    if (!label) return;

    const type = prompt('Enter type (cpanel, ftp, wordpress, database):', 'cpanel');
    if (!type) return;

    const username = prompt('Enter Username/Email:');
    const password = prompt('Enter Password:');

    const credentialPayload = {
      projectId: this.projectData.id,
      type: type,
      label: label,
      data: {
        username: username || 'admin',
        password: password || 'secret123',
      },
    };

    this.accessesService.createAccess(credentialPayload).subscribe({
      next: (newCredential) => {
        this.credentials.push(newCredential);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating project credential:', err);
        alert('Failed to save credential. Check your service method name.');
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
      this.assignedClients.push(client);
      this.syncClientsWithBackend();
    }
    this.closeClientModal();
  }

  removeClient(clientId: any) {
    this.assignedClients = this.assignedClients.filter((c) => c.id !== clientId);
    this.syncClientsWithBackend();
  }

  private syncClientsWithBackend() {
    const clientIds = this.assignedClients.map((c) => c.id);
    this.projectsService.updateProject(this.projectData.id, { clients: clientIds }).subscribe({
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

    this.clientsService.getClients().subscribe({
      next: (data) => this.allClients.set(data),
      error: (err) => console.error('Error loading clients', err),
    });

    this.workersService.getWorkers().subscribe({
      next: (data) => this.allWorkers.set(data),
      error: (err) => console.error('Error loading workers', err),
    });
  }

  startEditing() {
    this._isEditing.set(true);
  }

  cancelEditing() {
    this._isEditing.set(false);
    this._projectData.update((p) => ({ ...p, description: this.backupDescription }));
  }

  saveChanges() {
    const id = this.projectData.id;
    this.projectsService
      .updateProject(id, { description: this.projectData.description })
      .subscribe({
        next: (updated) => {
          this._projectData.set(updated);
          this.backupDescription = updated.description || '';
          this._isEditing.set(false);
        },
        error: (err) => console.error('Error saving project description', err),
      });
  }

  togglePasswordVisibility(credId: string) {
    this.visiblePasswords[credId] = !this.visiblePasswords[credId];
  }

  addCredential() {
    console.log('Action to add a new credential to the digital vault');
  }

  openClientModal() {
    this._showClientModal.set(true);
  }
  closeClientModal() {
    this._showClientModal.set(false);
    this.clientSearchQuery = '';
  }

  isClientAssigned(clientId: string): boolean {
    return this.assignedClients.some((c) => c.id === clientId);
  }

  confirmAssignClient(client: any) {
    this._assignedClients.update((list) => [...list, client]);
    this.closeClientModal();
  }

  removeClient(clientId: string) {
    this._assignedClients.update((list) => list.filter((c) => c.id !== clientId));
  }

  openWorkerModal() {
    this._showWorkerModal.set(true);
  }
  closeWorkerModal() {
    this._showWorkerModal.set(false);
    this.workerSearchQuery = '';
  }

  isWorkerAssigned(workerId: any): boolean {
    return this.assignedTeam.some((w) => w.userId === workerId || w.id === workerId);
  }

  confirmAssignWorker(worker: any) {
    const newMember = {
      userId: worker.id,
      name: worker.name,
      role: worker.role,
      projectId: this.projectData.id,
    };
    this._assignedTeam.update((list) => [...list, newMember]);
    this.closeWorkerModal();
  }

  removeWorker(userId: any) {
    this._assignedTeam.update((list) => list.filter((w) => w.userId !== userId));
  }
}
