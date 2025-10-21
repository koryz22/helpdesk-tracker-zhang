import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asset, CreateAsset } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private apiUrl = 'http://localhost:5024/api/assets';

  constructor(private http: HttpClient) {}

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.apiUrl);
  }

  createAsset(asset: CreateAsset): Observable<Asset> {
    return this.http.post<Asset>(this.apiUrl, asset);
  }
}

