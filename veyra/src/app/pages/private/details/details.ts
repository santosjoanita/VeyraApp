import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { ClientsService } from '../../../core/services/clients/clients.service';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { Client } from '../../../core/class/client.model';
import { Project } from '../../../core/class/project.model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  client: Client | null = null;
  clientProjects: Project[] = [];

  isEditing = false;
  editData: Partial<Client> = {};

  constructor(
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private projectsService: ProjectsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClientData(id);
    }
  }

  loadClientData(id: string) {
    this.clientsService.getClientById(id).subscribe({
      next: (data) => {
        this.client = data;
        this.editData = { ...data };
      },
      error: (err) => console.error('Erro ao carregar cliente', err),
    });

    this.projectsService.getProjects(id).subscribe({
      next: (projects) => (this.clientProjects = projects),
      error: (err) => console.error('Erro ao carregar projetos do cliente', err),
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.client) {
      this.editData = { ...this.client };
    }
  }

  saveClient() {
    if (this.client) {
      this.clientsService.updateClient(this.client.id, this.editData).subscribe({
        next: (updatedClient) => {
          this.client = updatedClient;
          this.isEditing = false;
        },
        error: (err) => console.error('Erro ao atualizar cliente', err),
      });
    }
  }
}
