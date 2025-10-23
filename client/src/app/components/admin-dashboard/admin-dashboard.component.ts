import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TicketService } from '../../services/ticket.service';
import { AssetService } from '../../services/asset.service';
import { AuthService } from '../../services/auth.service';
import { Ticket, UpdateTicket, CreateTicket } from '../../models/ticket.model';
import { Asset } from '../../models/asset.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  assets: Asset[] = [];
  filteredTickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  showUpdateModal = false;
  showCreateTicketModal = false;
  updateData: UpdateTicket = {};
  newTicket: CreateTicket = {
    assetID: '',
    title: '',
    description: '',
    priority: 'Medium'
  };
  loading = false;
  errorMessage = '';
  
  // Filter options
  filterStatus = '';
  filterPriority = '';
  filterAssetType = '';

  constructor(
    private ticketService: TicketService,
    private assetService: AssetService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTickets();
    this.loadAssets();
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
      }
    });
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

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const statusMatch = !this.filterStatus || ticket.status === this.filterStatus;
      const priorityMatch = !this.filterPriority || ticket.priority === this.filterPriority;
      const assetTypeMatch = !this.filterAssetType || ticket.assetType === this.filterAssetType;
      return statusMatch && priorityMatch && assetTypeMatch;
    });
  }

  openUpdateModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.updateData = {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status
    };
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedTicket = null;
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

  updateTicket(): void {
    if (!this.selectedTicket) return;

    this.loading = true;
    this.ticketService.updateTicket(this.selectedTicket.ticketID, this.updateData).subscribe({
      next: () => {
        this.loading = false;
        this.closeUpdateModal();
        this.loadTickets();
      },
      error: (error) => {
        this.loading = false;
        console.error('Error updating ticket:', error);
      }
    });
  }

  deleteTicket(ticketId: string): void {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    this.ticketService.deleteTicket(ticketId).subscribe({
      next: () => {
        this.loadTickets();
      },
      error: (error) => {
        console.error('Error deleting ticket:', error);
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

  getTicketStats() {
    return {
      total: this.tickets.length,
      open: this.tickets.filter(t => t.status === 'Open').length,
      inProgress: this.tickets.filter(t => t.status === 'In Progress').length,
      resolved: this.tickets.filter(t => t.status === 'Resolved').length,
    };
  }

  getUserFirstName(): string {
    const user = this.authService.getCurrentUser();
    if (user && user.fullName) {
      return user.fullName.split(' ')[0];
    }
    return 'User';
  }

  viewTicketDetail(ticketId: string): void {
    this.router.navigate(['/tickets/detail', ticketId]);
  }
}

