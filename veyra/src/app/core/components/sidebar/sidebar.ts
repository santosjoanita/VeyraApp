import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  isCollapsed = signal<boolean>(false);

  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());
  }
}