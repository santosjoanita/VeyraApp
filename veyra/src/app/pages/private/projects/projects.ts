import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';
import { AddProjectModal } from '../../../core/components/modals/add-project/add-project';
import { ConfirmDelete } from '../../../core/components/modals/confirm-delete/confirm-delete';
import { DataHandlerService } from '../../../core/services/data-handler.service';

import { ProjectsService } from '../../../core/services/projects/projects.service';
import { Project } from '../../../core/class/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Sidebar,
    Header,
    AddProjectModal,
    ConfirmDelete,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  showAddProject = false;
  showDeleteModal = false;
  itemToDeleteId: string | null = null;
  itemToDeleteName: string = '';

  searchQuery: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  selectedStatus: string = 'all';

  projectsList: Project[] = [];

  constructor(
    private dataHandler: DataHandlerService,
    private projectsService: ProjectsService,
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (data) => (this.projectsList = data),
      error: (err) => console.error('Erro ao carregar projetos', err),
    });
  }

  get displayedProjects(): Project[] {
    let result = this.dataHandler.filterArray(this.projectsList, this.searchQuery, ['name']);
    if (this.selectedStatus !== 'all') {
      result = this.dataHandler.filterArrayByValue(result, 'status', this.selectedStatus);
    }
    return this.dataHandler.sortArray(result, 'name', this.sortOrder);
  }

  toggleSort(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  handleSaveProject(newProjectData: any) {
    this.projectsService.createProject(newProjectData).subscribe({
      next: (createdProject) => {
        this.projectsList.push(createdProject);
        this.showAddProject = false;
      },
      error: (err) => console.error('Erro ao criar projeto', err),
    });
  }

  openDeleteModal(project: Project) {
    this.itemToDeleteId = project.id;
    this.itemToDeleteName = project.name;
    this.showDeleteModal = true;
  }

  handleConfirmDelete() {
    if (this.itemToDeleteId) {
      this.projectsService.deleteProject(this.itemToDeleteId).subscribe({
        next: () => {
          this.projectsList = this.projectsList.filter((p) => p.id !== this.itemToDeleteId);
          this.showDeleteModal = false;
          this.itemToDeleteId = null;
        },
        error: (err) => console.error('Erro ao apagar projeto', err),
      });
    }
  }
}
