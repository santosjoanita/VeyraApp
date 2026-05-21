import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 


import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header], 
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {}