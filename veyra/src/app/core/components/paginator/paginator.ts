import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() pageSizeOptions = [5, 10, 25, 50];

  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get startItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalItems ? this.totalItems : end;
  }

  changePage(amount: number): void {
    const newPage = this.currentPage + amount;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.pageChange.emit({ pageIndex: newPage, pageSize: this.pageSize });

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: newPage, limit: this.pageSize },
        queryParamsHandling: 'merge',
      });
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSize = Number(select.value);

    this.pageChange.emit({ pageIndex: 1, pageSize: newSize });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, limit: newSize },
      queryParamsHandling: 'merge',
    });
  }
}
