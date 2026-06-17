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

  workersCache = signal<{ [key: string]: string }>({});

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
    const currentUserId = localStorage.getItem('userId') || '';

    this.vacationsService.getVacations().subscribe({
      next: (data) => {
        if (this.isAdmin) {
          this.vacationsList.set(data);

          this.workersService.getWorkers().subscribe((workers) => {
            this.workersList.set(workers);
            const newCache: { [key: string]: string } = {};
            workers.forEach((w) => {
              newCache[w.id] = w.name;
            });
            this.workersCache.set(newCache);
          });
        } else {
          const myOwnVacations = data.filter((v) => String(v.userId) === String(currentUserId));
          this.vacationsList.set(myOwnVacations);

          if (currentUserId) {
            this.workersCache.set({ [currentUserId]: 'My Vacation' });
          }
        }
      },
      error: (err) => console.error('Error while loading vacations:', err),
    });
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

  calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startOffset = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

    const daysArray = [];
    const totalSlots = 42;

    for (let i = startOffset; i > 0; i--) {
      daysArray.push({ date: new Date(year, month, 1 - i), isCurrentMonth: false, vacations: [] });
    }

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= totalDaysInMonth; i++) {
      daysArray.push({ date: new Date(year, month, i), isCurrentMonth: true, vacations: [] });
    }

    const remainingSlots = totalSlots - daysArray.length;
    for (let i = 1; i <= remainingSlots; i++) {
      daysArray.push({ date: new Date(year, month + 1, i), isCurrentMonth: false, vacations: [] });
    }

    return daysArray.map((slot) => {
      const dateStr = slot.date.toISOString().split('T')[0];

      const dayVacations = this.vacationsList()
        .filter((v) => dateStr >= v.startDate && dateStr <= v.endDate)
        .map((v) => {
          const cachedName = this.workersCache()[v.userId];
          return {
            ...v,
            workerName: cachedName || 'Vacation',
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
    const colors = ['bg-green', 'bg-orange', 'bg-purple', 'bg-blue', 'bg-pink', 'bg-teal'];

    if (!userId) return colors[0];

    let idValue = 0;
    for (let i = 0; i < userId.length; i++) {
      idValue += userId.charCodeAt(i);
    }

    return colors[idValue % colors.length];
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
    setTimeout(() => this.loadInitialData(), 50);
  }

  setToday() {
    this.currentDate.set(new Date(2026, 5, 1));
    setTimeout(() => this.loadInitialData(), 50);
  }

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
}
