import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { Ticket } from '../../models/ticket.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-ticket-detail',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  loading = false;
  errorMessage = '';
  isAdmin = false;

  timelineEvents = [
    {
      id: '1',
      type: 'created',
      title: 'Ticket Created',
      description: 'Initial ticket submission',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), 
    },
    {
      id: '2',
      type: 'assigned',
      title: 'Ticket Assigned',
      description: 'Ticket assigned to support team',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), 
    },
    {
      id: '3',
      type: 'status_change',
      title: 'Status Updated',
      description: 'Status changed to In Progress',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId) {
      this.loadTicketDetails(ticketId);
    } else {
      this.errorMessage = 'Ticket ID not found';
    }
  }

  loadTicketDetails(ticketId: string): void {
    this.loading = true;
    
    this.ticketService.getTicket(ticketId).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        
        // Check authorization - users can only view their own tickets
        const currentUser = this.authService.getCurrentUser();
        if (!this.isAdmin && currentUser && this.ticket.userID !== currentUser.userID) {
          this.errorMessage = 'You do not have permission to view this ticket';
          this.loading = false;
          return;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ticket:', error);
        this.errorMessage = 'Failed to load ticket details';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    if (this.isAdmin) {
      this.router.navigate(['/dashboard/admin']);
    } else {
      this.router.navigate(['/dashboard/user']);
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTimelineIcon(type: string): string {
    switch (type) {
      case 'created':
        return 'M12 6v6m0 0v6m0-6h6m-6 0H6';
      case 'assigned':
        return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
      case 'status_change':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'comment':
        return 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getTimelineColor(type: string): string {
    switch (type) {
      case 'created':
        return 'bg-blue-500';
      case 'assigned':
        return 'bg-purple-500';
      case 'status_change':
        return 'bg-green-500';
      case 'comment':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  }
}
