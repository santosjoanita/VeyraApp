import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VacationsService {
  private apiUrl = 'http://localhost:3000/vacations';

  constructor(private http: HttpClient) {}

  getVacations(userId?: string): Observable<any[]> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId);
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getVacationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createVacation(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateVacation(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteVacation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
