import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; 

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details implements OnInit {
  entityType: string = '';
  entityId: string = '';
  
  data: any = {};
  projects: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.entityType = this.route.snapshot.paramMap.get('type') || 'worker';
    this.entityId = this.route.snapshot.paramMap.get('id') || '1';

    this.loadDataSimulated();
  }

  loadDataSimulated(): void {
    
    if (this.entityType === 'worker') {
      this.data = {
        name: 'Dexter Morgan',
        role: 'admin',
        isActive: true,
        email: 'morgan.dexter@veyra.com',
        phone: '+351 912 345 678',
        createdAt: '2025-01-10T10:00:00Z'
      };
    } else {
      this.data = {
        name: 'Acme Corp',
        role: 'client',
        isActive: false,
        email: 'contact@acmecorp.com',
        phone: '+351 210 000 000',
        createdAt: '2025-02-15T10:00:00Z'
      };
    }

    this.projects = [
      { id: 1, name: 'Veyra Dashboard Redesign', endDate: '2026-05-25', status: 'active' },
      { id: 2, name: 'Brandit Mobile App', endDate: '2026-06-10', status: 'completed' },
      { id: 3, name: 'Client Portal API', endDate: '2026-07-14', status: 'paused' }
    ];
  }
}