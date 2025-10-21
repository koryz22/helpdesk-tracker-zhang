import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { AssetService } from '../../services/asset.service';
import { TicketService } from '../../services/ticket.service';
import { Asset } from '../../models/asset.model';
import { Ticket, CreateTicket } from '../../models/ticket.model';

@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  assets: Asset[] = [];
  tickets: Ticket[] = [];
  showCreateTicketModal = false;
  newTicket: CreateTicket = {
    assetID: '',
    title: '',
    description: '',
    priority: 'Medium'
  };
  loading = false;
  errorMessage = '';

  constructor(
    private assetService: AssetService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.loadAssets();
    this.loadTickets();
  }

  loadAssets(): void {
    this.assetService.getAssets().subscribe({
      next: (assets) => {
        this.assets = assets;
      },
      error: (error) => {
        console.error('Error loading assets:', error);
      }
    });
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
      }
    });
  }

  openCreateTicketModal(): void {
    this.showCreateTicketModal = true;
    this.newTicket = {
      assetID: this.assets[0]?.assetID || '',
      title: '',
      description: '',
      priority: 'Medium'
    };
    this.errorMessage = '';
  }

  closeCreateTicketModal(): void {
    this.showCreateTicketModal = false;
    this.errorMessage = '';
  }

  createTicket(): void {
    if (!this.newTicket.title || !this.newTicket.assetID) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.ticketService.createTicket(this.newTicket).subscribe({
      next: () => {
        this.loading = false;
        this.closeCreateTicketModal();
        this.loadTickets();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error creating ticket';
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}

