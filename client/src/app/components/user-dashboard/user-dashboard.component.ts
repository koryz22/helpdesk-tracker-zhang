import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  pieChartData: any[] = [];
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
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAssets();
    this.loadTickets();
    // Initialize pie chart data with empty state
    this.pieChartData = this.getPieChartData();
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
        this.refreshPieChart();
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.refreshPieChart(); // Refresh even on error to show empty state
      }
    });
  }

  refreshPieChart(): void {
    this.pieChartData = this.getPieChartData();
    console.log('Pie chart refreshed:', this.pieChartData);
  }

  openCreateTicketModal(): void {
    console.log('Opening create ticket modal...');
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
        this.loadTickets(); // This will refresh pieChartData
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

  viewTicketDetail(ticketId: string): void {
    this.router.navigate(['/tickets/detail', ticketId]);
  }

  getTicketStatusData(): { status: string; count: number; color: string }[] {
    const openCount = this.tickets.filter(ticket => ticket.status === 'Open').length;
    const inProgressCount = this.tickets.filter(ticket => ticket.status === 'In Progress').length;
    const resolvedCount = this.tickets.filter(ticket => ticket.status === 'Resolved').length;
    const closedCount = this.tickets.filter(ticket => ticket.status === 'Closed').length;

    return [
      { status: 'Open', count: openCount, color: '#3b82f6' }, // blue-500
      { status: 'In Progress', count: inProgressCount, color: '#f59e0b' }, // yellow-500
      { status: 'Resolved', count: resolvedCount, color: '#22c55e' }, // green-500
      { status: 'Closed', count: closedCount, color: '#6b7280' }  // gray-500
    ];
  }

  getMaxStatusCount(): number {
    const statusData = this.getTicketStatusData();
    const counts = statusData.map(data => data.count);
    return Math.max(...counts, 5); // Ensure a minimum of 5 for better visualization if all counts are low
  }

  getBarHeight(count: number, maxCount: number, svgHeight: number): number {
    if (maxCount === 0) return 0;
    // Scale count to SVG height, leaving some padding at the top
    return (count / maxCount) * (svgHeight - 20); // 20 for top padding
  }

  getBarY(count: number, maxCount: number, svgHeight: number): number {
    // Y position is SVG height minus bar height
    return svgHeight - this.getBarHeight(count, maxCount, svgHeight);
  }

  getPieChartData(): { label: string; count: number; percentage: number; color: string; path: string; labelX: number; labelY: number }[] {
    const priorities = ['High', 'Medium', 'Low'];
    const colors = ['#ef4444', '#f59e0b', '#22c55e']; // red, yellow, green
    const data = priorities.map(priority => {
      const count = this.tickets.filter(ticket => ticket.priority === priority).length;
      return { priority, count };
    });

    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    // Debug logging
    console.log('Pie Chart Debug - Tickets:', this.tickets);
    console.log('Pie Chart Debug - Data:', data);
    console.log('Pie Chart Debug - Total:', total);
    
    if (total === 0) {
      return priorities.map((priority, index) => ({
        label: priority,
        count: 0,
        percentage: 0,
        color: colors[index],
        path: '',
        labelX: 100,
        labelY: 100
      }));
    }

    // Special case for single ticket - show as full circle
    if (total === 1) {
      const singleItem = data.find(item => item.count > 0);
      if (singleItem) {
        const priorityIndex = priorities.indexOf(singleItem.priority);
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        
        return priorities.map((priority, index) => {
          if (priority === singleItem.priority) {
            // Full circle for the single item
            const path = `M ${centerX} ${centerY} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`;
            return {
              label: priority,
              count: 1,
              percentage: 100,
              color: colors[priorityIndex],
              path,
              labelX: centerX,
              labelY: centerY
            };
          } else {
            return {
              label: priority,
              count: 0,
              percentage: 0,
              color: colors[index],
              path: '',
              labelX: centerX,
              labelY: centerY
            };
          }
        });
      }
    }

    let currentAngle = 0;
    const centerX = 100;
    const centerY = 100;
    const radius = 80;

    return data.map((item, index) => {
      const percentage = Math.round((item.count / total) * 100);
      const angle = (item.count / total) * 360;
      
      let path = '';
      let labelX = centerX;
      let labelY = centerY;
      
      if (item.count > 0) {
        // Calculate path for pie segment
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;
        
        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);
        
        const largeArcFlag = angle > 180 ? 1 : 0;
        path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        
        // Calculate label position (middle of segment)
        const labelAngle = currentAngle + angle / 2;
        const labelAngleRad = (labelAngle * Math.PI) / 180;
        labelX = centerX + (radius * 0.7) * Math.cos(labelAngleRad);
        labelY = centerY + (radius * 0.7) * Math.sin(labelAngleRad);
        
        currentAngle += angle;
      }
      
      return {
        label: item.priority,
        count: item.count,
        percentage,
        color: colors[index],
        path,
        labelX,
        labelY
      };
    });
  }

  roundNumber(value: number): number {
    return Math.round(value);
  }

}

