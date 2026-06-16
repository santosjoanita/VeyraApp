import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VacationsService } from '../../../core/services/vacations/vacations.service';
import { WorkersService } from '../../../core/services/workers/workers.service';
import { AddVacationModal } from '../../../core/components/modals/add-vacation-modal/add-vacation-modal';

import { Sidebar } from '../../../core/components/sidebar/sidebar';
import { Header } from '../../../core/components/header/header';

@Component({
  selector: 'app-vacations',
  standalone: true,
  imports: [CommonModule, FormsModule, AddVacationModal, Sidebar, Header],
  templateUrl: './vacations.html',
  styleUrl: './vacations.css',
})
export class Vacations implements OnInit {
  private vacationsService = inject(VacationsService);
  private workersService = inject(WorkersService);

  currentDate = signal<Date>(new Date(2026, 5, 1));
  vacationsList = signal<any[]>([]);
  workersList = signal<any[]>([]);

  searchQuery = signal<string>('');
  selectedWorkerId = signal<string | null>(null);
  selectedRoleFilter = signal<string>('all');

  showAddModal = false;
  currentView = 'monthly';

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.vacationsService.getVacations().subscribe((data) => this.vacationsList.set(data));
    this.workersService.getWorkers().subscribe((data) => this.workersList.set(data));
  }

  filteredWorkers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const role = this.selectedRoleFilter().toLowerCase();

    return this.workersList().filter((worker) => {
      const matchesSearch = worker.name.toLowerCase().includes(query);
      const workerRole = (worker.role || '').toLowerCase();
      const matchesRole = role === 'all' ? true : workerRole === role;
      return matchesSearch && matchesRole;
    });
  });

  handleSaveVacation(payload: any) {
    const apiPayload = {
      startDate: payload.startDate,
      endDate: payload.endDate,
      note: payload.note || '',
    };

    this.vacationsService.createVacation(apiPayload).subscribe({
      next: () => {
        this.loadInitialData();
        this.showAddModal = false;
      },
      error: (err) => console.error('Error saving vacation schedule:', err),
    });
  }
  calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    let startOffset = firstDayOfMonth.getDay() - 1;
    if (startOffset === -1) startOffset = 6;

    const daysArray = [];
    const totalSlots = 42;

    for (let i = startOffset; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      daysArray.push({ date: prevDate, isCurrentMonth: false, vacations: [] });
    }

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const currDate = new Date(year, month, i);
      daysArray.push({ date: currDate, isCurrentMonth: true, vacations: [] });
    }

    const remainingSlots = totalSlots - daysArray.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextDate = new Date(year, month + 1, i);
      daysArray.push({ date: nextDate, isCurrentMonth: false, vacations: [] });
    }

    return daysArray.map((slot) => {
      const dateStr = slot.date.toISOString().split('T')[0];

      const dayVacations = this.vacationsList()
        .filter((v) => {
          return dateStr >= v.startDate && dateStr <= v.endDate;
        })
        .map((v) => {
          const worker = this.workersList().find((w) => w.id === v.userId);
          return {
            ...v,
            workerName: worker ? worker.name : 'Unknown',
            colorClass: this.getUserColorClass(v.userId),
          };
        });

      const isToday =
        slot.date.getDate() === 15 &&
        slot.date.getMonth() === 5 &&
        slot.date.getFullYear() === 2026;

      return {
        ...slot,
        isToday,
        isWeekend: slot.date.getDay() === 0 || slot.date.getDay() === 6,
        vacations: dayVacations,
      };
    });
  });

  getUserColorClass(userId: string): string {
    if (userId === 'mariana-id') return 'bg-green';
    if (userId === 'beatriz-id') return 'bg-orange';
    return 'bg-purple';
  }

  toggleWorkerSelect(workerId: string) {
    if (this.selectedWorkerId() === workerId) {
      this.selectedWorkerId.set(null);
    } else {
      this.selectedWorkerId.set(workerId);
    }
  }

  changeMonth(direction: number) {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + direction, 1));
  }

  setToday() {
    this.currentDate.set(new Date(2026, 5, 1));
  }
}
