import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { ClientsService } from '../../../core/services/clients/clients.service';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { ProjectWorkersService } from '../../../core/services/projects/project-workers.service';
import { WorkersService } from '../../../core/services/workers/workers.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header],
  templateUrl: './details.html',
  styleUrls: ['./details.css', '../../../../assets/themes/variables.css'],
})
export class Details implements OnInit {
  private route = inject(ActivatedRoute);
  private clientsService = inject(ClientsService);
  private projectsService = inject(ProjectsService);
  private projectWorkersService = inject(ProjectWorkersService);
  private workersService = inject(WorkersService);
  private cdr = inject(ChangeDetectorRef);

  data: any = {};
  projects: any[] = [];
  entityType = 'client';
  isEditing = false;

  private backupData = {};
  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const currentUrl = this.route.snapshot.pathFromRoot.map((r) => r.routeConfig?.path).join('/');

    if (currentUrl.includes('workers')) {
      this.entityType = 'worker';
    } else {
      this.entityType = 'client';
    }

    if (id) {
      if (this.entityType === 'worker') {
        this.loadWorkerData(id);
      } else {
        this.loadClientData(id);
      }
    }
  }

  loadClientData(id: string) {
    this.clientsService.getClientById(id).subscribe({
      next: (clientData) => {
        this.data = clientData;
        this.backupData = { ...clientData };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading client data:', err);
        this.cdr.detectChanges();
      },
    });

    this.projectsService.getProjects(id).subscribe({
      next: (projectsList) => {
        this.projects = projectsList;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading client projects:', err);
        this.cdr.detectChanges();
      },
    });
  }

  loadWorkerData(id: string) {
    this.workersService.getWorkerById(id).subscribe({
      next: (workerData) => {
        this.data = workerData;
        this.backupData = { ...workerData };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading worker data:', err);
        this.cdr.detectChanges();
      },
    });

    this.projectsService.getProjects(undefined, undefined).subscribe({
      next: (projectList) => {
        const associatedProjects: any[] = [];
        let completed = 0;

        if (!projectList.length) {
          this.projects = [];
          this.cdr.detectChanges();
          return;
        }

        projectList.forEach((project) => {
          this.projectWorkersService.getProjectWorkers(project.id).subscribe({
            next: (assignments) => {
              const isAssigned = assignments.some(
                (worker) => worker.userId === id || worker.id === id,
              );
              if (isAssigned) {
                associatedProjects.push(project);
              }
              completed += 1;
              if (completed === projectList.length) {
                this.projects = associatedProjects;
                this.cdr.detectChanges();
              }
            },
            error: (err) => {
              console.error('Error loading project workers for', project.id, err);
              completed += 1;
              if (completed === projectList.length) {
                this.projects = associatedProjects;
                this.cdr.detectChanges();
              }
            },
          });
        });
      },
      error: (err) => {
        console.error('Error loading projects for worker details:', err);
        this.cdr.detectChanges();
      },
    });
  }

  startEditing() {
    this.isEditing = true;
    this.cdr.detectChanges();
  }

  cancelEditing() {
    this.isEditing = false;
    this.data = { ...this.backupData };
    this.cdr.detectChanges();
  }

  saveChanges() {
    if (this.data && this.data.id) {
      if (this.entityType === 'worker') {
        const workerPayload: any = {
          name: this.data.name,
          role: this.data.role,
          isActive: this.data.isActive,
        };

        this.workersService.updateWorker(this.data.id, workerPayload).subscribe({
          next: (updatedWorker) => {
            this.data = updatedWorker;
            this.backupData = { ...updatedWorker };
            this.isEditing = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error updating worker data:', err);
            this.cdr.detectChanges();
          },
        });
      } else {
        const { id, createdAt, updatedAt, ...payload } = this.data;

        this.clientsService.updateClient(this.data.id, payload).subscribe({
          next: (updatedClient) => {
            this.data = updatedClient;
            this.backupData = { ...updatedClient };
            this.isEditing = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error updating client data:', err);
            this.cdr.detectChanges();
          },
        });
      }
    }
  }
}
