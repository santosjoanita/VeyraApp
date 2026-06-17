import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private router = inject(Router);
  isCollapsed = signal<boolean>(true);

  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  isItemActive(adminRoute: string, type: string): boolean {
    const currentUrl = this.router.url;

    if (this.isAdmin) {
      return currentUrl.includes(adminRoute);
    }

    return currentUrl.includes('/not-permitted') && currentUrl.includes(`type=${type}`);
  }
}
