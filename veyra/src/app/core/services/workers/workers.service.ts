import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Worker } from '../../../core/class/worker.model';

@Injectable({
  providedIn: 'root',
})
export class WorkersService {
  private apiUrl = 'http://localhost:3000/workers';

  constructor(private http: HttpClient) {}

  getWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(this.apiUrl);
  }

  getWorkerById(id: string | number): Observable<Worker> {
    return this.http.get<Worker>(`${this.apiUrl}/${id}`);
  }

  createWorker(data: any): Observable<Worker> {
    return this.http.post<Worker>(this.apiUrl, data);
  }

  updateWorker(id: string | number, data: any): Observable<Worker> {
    return this.http.patch<Worker>(`${this.apiUrl}/${id}`, data);
  }

  deleteWorker(id: string | number): Observable<Worker> {
    return this.http.delete<Worker>(`${this.apiUrl}/${id}`);
  }
}
