import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css' 
})
export class Dashboard {

}