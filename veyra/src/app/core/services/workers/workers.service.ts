import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Worker } from '../../../core/class/worker.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkersService {
  private apiUrl = `${environment.apiUrl}/workers`;

  private refresh$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  get refresh() {
    return this.refresh$.asObservable();
  }

  triggerRefresh() {
    this.refresh$.next();
  }

  private getHttpOptions() {
    const token = localStorage.getItem('accessToken');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };
  }

  getWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(this.apiUrl, this.getHttpOptions());
  }

  getWorkerById(id: string | number): Observable<Worker> {
    return this.http.get<Worker>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  createWorker(data: any): Observable<Worker> {
    return this.http.post<Worker>(this.apiUrl, data, this.getHttpOptions());
  }

  updateWorker(id: string | number, data: any): Observable<Worker> {
    return this.http.patch<Worker>(`${this.apiUrl}/${id}`, data, this.getHttpOptions());
  }

  deleteWorker(id: string | number): Observable<Worker> {
    return this.http.delete<Worker>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}
