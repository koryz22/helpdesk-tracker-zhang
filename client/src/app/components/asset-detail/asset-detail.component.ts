import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService } from '../../services/asset.service';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { Asset } from '../../models/asset.model';
import { Ticket } from '../../models/ticket.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-asset-detail',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
  asset: Asset | null = null;
  tickets: Ticket[] = [];
  loading = false;
  errorMessage = '';
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetService: AssetService,
    private ticketService: TicketService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    const assetId = this.route.snapshot.paramMap.get('id');
    if (assetId) {
      this.loadAssetDetails(assetId);
    } else {
      this.errorMessage = 'Asset ID not found';
    }
  }

  loadAssetDetails(assetId: string): void {
    this.loading = true;
    
    // Load all assets and find the one we need
    this.assetService.getAssets().subscribe({
      next: (assets) => {
        this.asset = assets.find(a => a.assetID === assetId) || null;
        
        if (!this.asset) {
          this.errorMessage = 'Asset not found';
          this.loading = false;
          return;
        }
        
        // Check authorization - users can only view their own assets
        const currentUser = this.authService.getCurrentUser();
        if (!this.isAdmin && currentUser && this.asset.userID !== currentUser.userID) {
          this.errorMessage = 'You do not have permission to view this asset';
          this.loading = false;
          return;
        }
        
        // Load tickets for this asset
        this.loadTickets(assetId);
      },
      error: (error) => {
        console.error('Error loading asset:', error);
        this.errorMessage = 'Failed to load asset details';
        this.loading = false;
      }
    });
  }

  loadTickets(assetId: string): void {
    this.ticketService.getTickets().subscribe({
      next: (allTickets) => {
        // Filter tickets for this specific asset
        this.tickets = allTickets.filter(t => t.assetID === assetId);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.errorMessage = 'Failed to load tickets';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    if (this.isAdmin) {
      this.router.navigate(['/assets/admin']);
    } else {
      this.router.navigate(['/assets/user']);
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
}

