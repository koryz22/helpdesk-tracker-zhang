import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-user-assets',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './user-assets.component.html',
  styleUrls: ['./user-assets.component.css']
})
export class UserAssetsComponent implements OnInit {
  assets: Asset[] = [];
  filteredAssets: Asset[] = [];
  loading = false;
  errorMessage = '';
  
  // Search & Filter
  searchTerm = '';
  filterType = '';

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    this.loadAssets();
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

  applyFilters(): void {
    this.filteredAssets = this.assets.filter(asset => {
      const matchesSearch = 
        asset.assetName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        asset.assetType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (asset.description && asset.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesType = !this.filterType || asset.assetType === this.filterType;
      
      return matchesSearch && matchesType;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterType = '';
    this.applyFilters();
  }
}

