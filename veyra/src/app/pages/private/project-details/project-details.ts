import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { ProjectsService } from '../../../core/services/projects/projects.service';
import { ProjectAccessesService } from '../../../core/services/projects/project-accesses.service';
import { ProjectWorkersService } from '../../../core/services/projects/project-workers.service';
import { Project } from '../../../core/class/project.model';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Header],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetails implements OnInit {
  project: Project | null = null;
  credentials: any[] = [];
  team: any[] = [];

  isEditingNotes = false;
  notesData = '';

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private accessesService: ProjectAccessesService,
    private workersService: ProjectWorkersService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProjectData(id);
    }
  }

  loadProjectData(id: string) {
    this.projectsService.getProjectById(id).subscribe({
      next: (data) => {
        this.project = data;
        this.notesData = data.description || '';
      },
      error: (err) => console.error('Erro ao carregar projeto', err),
    });

    this.accessesService.getAccesses(id).subscribe({
      next: (data) => (this.credentials = data),
      error: (err) => console.error('Erro ao carregar acessos', err),
    });

    this.workersService.getProjectWorkers().subscribe({
      next: (data) => {
        this.team = data.filter((w) => w.projectId === id);
      },
      error: (err) => console.error('Erro ao carregar equipa', err),
    });
  }

  toggleEditNotes() {
    this.isEditingNotes = !this.isEditingNotes;
    if (!this.isEditingNotes && this.project) {
      this.notesData = this.project.description || '';
    }
  }

  saveNotes() {
    if (this.project) {
      this.projectsService
        .updateProject(this.project.id, { description: this.notesData })
        .subscribe({
          next: (updatedProject) => {
            this.project = updatedProject;
            this.isEditingNotes = false;
          },
          error: (err) => console.error('Erro ao guardar notas', err),
        });
    }
  }
}
