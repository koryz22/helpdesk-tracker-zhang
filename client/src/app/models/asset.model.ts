export interface Asset {
  assetID: string;
  assetType: string;
  assetName: string;
  description?: string;
  userID: string;
  userName?: string;
}

export interface CreateAsset {
  assetType: string;
  assetName: string;
  description?: string;
  userID: string;
}

