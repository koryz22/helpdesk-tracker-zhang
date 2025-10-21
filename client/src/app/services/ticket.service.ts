import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, CreateTicket, UpdateTicket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5024/api/tickets';

  constructor(private http: HttpClient) {}

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  getTicket(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  createTicket(ticket: CreateTicket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  updateTicket(id: string, ticket: UpdateTicket): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket);
  }

  deleteTicket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

