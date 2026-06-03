import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { ClientsService } from '../../../core/services/clients/clients.service';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { WorkersService } from '../../../core/services/workers/workers.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientsService = inject(ClientsService);
  private projectsService = inject(ProjectsService);
  private workersService = inject(WorkersService);

  private _data = signal<any>({});
  private _projects = signal<any[]>([]);
  private _isEditing = signal(false);
  private _entityType = signal<'client' | 'worker'>('client');

  private backupData: any = {};

  get data() {
    return this._data();
  }
  set data(value: any) {
    this._data.set(value);
  }

  get projects() {
    return this._projects();
  }
  get isEditing() {
    return this._isEditing();
  }
  get entityType() {
    return this._entityType();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (this.router.url.includes('worker')) {
      this._entityType.set('worker');
    } else {
      this._entityType.set('client');
    }

    if (id) {
      this.loadData(id);
    }
  }

  loadData(id: string) {
    if (this.entityType === 'client') {
      this.clientsService.getClientById(id).subscribe({
        next: (res) => {
          this._data.set(res);
          this.backupData = { ...res };
        },
        error: (err) => console.error('Error while loading client details', err),
      });

      this.projectsService.getProjects(id).subscribe({
        next: (res) => this._projects.set(res),
        error: (err) => console.error('Error while loading client projects', err),
      });
    } else {
      this.workersService.getWorkers().subscribe({
        next: (workers: any[]) => {
          const worker = workers.find((w) => String(w.id) === id);
          if (worker) {
            this._data.set(worker);
            this.backupData = { ...worker };
          }
        },
        error: (err) => console.error('Error while loading worker details', err),
      });
      this._projects.set([]);
    }
  }

  startEditing() {
    this._isEditing.set(true);
  }

  cancelEditing() {
    this._isEditing.set(false);
    this._data.set({ ...this.backupData });
  }

  saveChanges() {
    const currentData = this.data;
    if (this.entityType === 'client') {
      this.clientsService.updateClient(currentData.id, currentData).subscribe({
        next: (updatedClient) => {
          this._data.set(updatedClient);
          this.backupData = { ...updatedClient };
          this._isEditing.set(false);
        },
        error: (err) => console.error('Error while updating client', err),
      });
    } else {
      this.workersService.updateWorker(currentData.id, currentData).subscribe({
        next: () => {
          this.backupData = { ...currentData };
          this._isEditing.set(false);
        },
        error: (err) => console.error('Error while updating worker', err),
      });
    }
  }
}
