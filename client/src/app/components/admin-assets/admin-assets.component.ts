import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../services/asset.service';
import { UserService } from '../../services/user.service';
import { Asset, CreateAsset } from '../../models/asset.model';
import { User } from '../../models/user.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-admin-assets',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './admin-assets.component.html',
  styleUrls: ['./admin-assets.component.css']
})
export class AdminAssetsComponent implements OnInit {
  assets: Asset[] = [];
  users: User[] = [];
  filteredAssets: Asset[] = [];
  loading = false;
  errorMessage = '';
  
  // Search & Filter
  searchTerm = '';
  filterType = '';
  filterUser = '';
  
  // Create Modal
  showCreateModal = false;
  newAsset: CreateAsset = {
    assetType: 'Home',
    assetName: '',
    description: '',
    userID: ''
  };

  constructor(
    private assetService: AssetService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAssets();
    this.loadUsers();
  }

  loadAssets(): void {
    this.loading = true;
    this.assetService.getAssets().subscribe({
      next: (data) => {
        this.assets = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading assets:', error);
        this.errorMessage = 'Failed to load assets';
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredAssets = this.assets.filter(asset => {
      const matchesSearch = 
        asset.assetName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        asset.assetType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (asset.description && asset.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (asset.userName && asset.userName.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesType = !this.filterType || asset.assetType === this.filterType;
      const matchesUser = !this.filterUser || asset.userID === this.filterUser;
      
      return matchesSearch && matchesType && matchesUser;
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.errorMessage = '';
    this.newAsset = {
      assetType: 'Home',
      assetName: '',
      description: '',
      userID: this.users.length > 0 ? this.users[0].userID : ''
    };
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.errorMessage = '';
  }

  createAsset(): void {
    if (!this.newAsset.assetName || !this.newAsset.userID) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.assetService.createAsset(this.newAsset).subscribe({
      next: () => {
        this.loadAssets();
        this.closeCreateModal();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating asset:', error);
        this.errorMessage = 'Failed to create asset';
        this.loading = false;
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterType = '';
    this.filterUser = '';
    this.applyFilters();
  }
}

