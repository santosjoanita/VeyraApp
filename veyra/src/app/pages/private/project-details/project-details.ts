import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Sidebar, Header],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css'
})
export class ProjectDetails implements OnInit {
  projectId: string = '';
  isEditing: boolean = false;
  
  projectData: any = {};
  
  credentials: any[] = [];
  
  assignedClients: any[] = [];
  assignedTeam: any[] = [];

  visiblePasswords: { [key: string]: boolean } = {};

  showClientModal: boolean = false;
  showWorkerModal: boolean = false;

  clientSearchQuery: string = '';
  workerSearchQuery: string = '';

  allClients: any[] = [];
  allWorkers: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || 'p1';
    this.loadSimulatedData();
    this.loadGlobalLists();
  }

  loadSimulatedData(): void {
    this.projectData = {
      name: 'Veyra Dashboard Redesign',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      description: 'Redesign completo do painel de administração da Veyra com foco na usabilidade e gestão de infraestruturas cloud. Inclui integração com a nova API v2.',
      createdAt: '2025-01-01T10:00:00Z'
    };

    this.assignedClients = [
      { id: 'c1', name: 'Acme Corp', email: 'contact@acmecorp.com' }
    ];

    this.assignedTeam = [
      { userId: 'w1', name: 'Dexter Morgan', role: 'admin', assignedAt: '2025-01-05' },
      { userId: 'w2', name: 'Debra Morgan', role: 'worker', assignedAt: '2025-01-10' }
    ];

    this.credentials = [
      {
        id: 'acc1',
        type: 'cpanel',
        label: 'Servidor Principal de Produção',
        data: {
          username: 'admin_veyra',
          password: 'SuperSecretPassword123!',
          url: 'https://cpanel.veyra.com'
        }
      },
      {
        id: 'acc2',
        type: 'database',
        label: 'Base de Dados',
        data: {
          host: 'db-prod.veyra.internal',
          username: 'root',
          password: 'DbPassword2025#',
          port: '3306'
        }
      }
    ];

    this.credentials.forEach(cred => {
      this.visiblePasswords[cred.id] = false;
    });
  }

  loadGlobalLists(): void{
    this.allClients = [
      { id: 'c1', name: 'Acme Corp', email: 'contact@acmecorp.com' },
      { id: 'c2', name: 'Global Industries', email: 'info@globa.com' },
      { id: 'c3', name: 'TechFlow Solutions', email: 'hello@techflow.pt' }
    ];

    this.allWorkers = [
      { id: 'w1', name: 'Dexter Morgan', email: 'dexter@brandit.pt', role: 'admin' },
      { id: 'w2', name: 'Debra Morgan', email: 'debra@brandit.pt', role: 'worker' },
      { id: 'w3', name: 'Angel Batista', email: 'angel@brandit.pt', role: 'worker' },
      { id: 'w4', name: 'Vince Masuka', email: 'masuka@brandit.pt', role: 'worker' }
    ];
  }

  get filteredClients(){
    return this.allClients.filter(client => 
      client.name.toLowerCase().includes(this.clientSearchQuery.toLowerCase())
    );
  }

  get filteredWorkers(){
    return this.allWorkers.filter(worker => 
      worker.name.toLowerCase().includes(this.workerSearchQuery.toLowerCase())
    );
  }

  openClientModal(): void{
    this.clientSearchQuery ='';
    this.showClientModal = true;
  }
  closeClientModal(): void{
    this.showClientModal = false;
  }

  openWorkerModal(): void{
    this.workerSearchQuery ='',
    this.showWorkerModal = true;
  }

  closeWorkerModal(): void{
    this.showWorkerModal = false;
  }
isClientAssigned(clientId: string): boolean {
    return this.assignedClients.some(c => c.id === clientId);
  }

  isWorkerAssigned(workerId: string): boolean {
    return this.assignedTeam.some(w => w.userId === workerId);
  }
  confirmAssignClient(client: any): void{
    if(this.isClientAssigned(client.id)) return;
    this.assignedClients.push(client);
    this.closeClientModal();
  }

  confirmAssignWorker(worker: any): void{
    if(this.isWorkerAssigned(worker.userId)) return;
    this.assignedTeam.push({
      userId: worker.id,
      name: worker.name,
      role: worker.role,
      assignedAt: new Date().toISOString()
    });
    this.closeWorkerModal();
  }

  togglePasswordVisibility(id: string): void {
    this.visiblePasswords[id] = !this.visiblePasswords[id];
  }

  startEditing(): void {
    this.isEditing = true;
  }

  saveChanges(): void {
    console.log('A guardar alterações do projeto:', this.projectData);
    this.isEditing = false;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.loadSimulatedData(); 
  }

  addCredential(): void {
    console.log('Adicionar credencial...');
  }

  assignClient(): void {
    console.log('Atribuir cliente...');
  }

  assignTeamMember(): void {
    console.log('Atribuir membro da equipa...');
  }
  
  removeClient(clientId: string): void {
    this.assignedClients = this.assignedClients.filter(c => c.id !== clientId);
  }

  removeWorker(workerId: string): void {
    this.assignedTeam = this.assignedTeam.filter(w => w.userId !== workerId);
  }
}