import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../../core/class/client.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('accessToken');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl, this.getHttpOptions());
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  createClient(clientData: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, clientData, this.getHttpOptions());
  }

  updateClient(id: string, clientData: Partial<Client>): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, clientData, this.getHttpOptions());
  }

  deleteClient(id: string): Observable<Client> {
    return this.http.delete<Client>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}
