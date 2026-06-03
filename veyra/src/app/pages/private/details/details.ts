import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { ClientsService } from '../../../core/services/clients/clients.service';
import { ProjectsService } from '../../../core/services/projects/projects.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  private route = inject(ActivatedRoute);
  private clientsService = inject(ClientsService);
  private projectsService = inject(ProjectsService);

  data: any = {};
  projects: any[] = [];
  entityType = 'client';
  isEditing = false;

  private backupData = {};

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClientData(id);
    }
  }

  loadClientData(id: string) {
    this.clientsService.getClientById(id).subscribe({
      next: (clientData) => {
        this.data = clientData;
        this.backupData = { ...clientData };
      },
      error: (err) => console.error('Erro ao carregar cliente', err),
    });

    this.projectsService.getProjects(id).subscribe({
      next: (projectsList) => (this.projects = projectsList),
      error: (err) => console.error('Erro ao carregar projetos do cliente', err),
    });
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    this.data = { ...this.backupData };
  }

  saveChanges() {
    if (this.data && this.data.id) {
      this.clientsService.updateClient(this.data.id, this.data).subscribe({
        next: (updatedClient) => {
          this.data = updatedClient;
          this.backupData = { ...updatedClient };
          this.isEditing = false;
        },
        error: (err) => console.error('Erro ao atualizar cliente', err),
      });
    }
  }
}
