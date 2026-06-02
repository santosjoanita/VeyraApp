import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workers } from '../../../pages/private/workers/workers';

@Injectable({
  providedIn: 'root',
})
export class WorkersService {
  private apiUrl = 'http://localhost:3000/workers';

  constructor(private http: HttpClient) {}

  getWorkers(): Observable<Workers[]> {
    return this.http.get<Workers[]>(this.apiUrl);
  }

  getWorkerById(id: string | number): Observable<Workers> {
    return this.http.get<Workers>(`${this.apiUrl}/${id}`);
  }

  createWorker(data: any): Observable<Workers> {
    return this.http.post<Workers>(this.apiUrl, data);
  }

  updateWorker(id: string | number, data: any): Observable<Workers> {
    return this.http.patch<Workers>(`${this.apiUrl}/${id}`, data);
  }

  deleteWorker(id: string | number): Observable<Workers> {
    return this.http.delete<Workers>(`${this.apiUrl}/${id}`);
  }
}
