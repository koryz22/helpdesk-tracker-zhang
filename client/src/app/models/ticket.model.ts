export interface Ticket {
  ticketID: string;
  userID: string;
  userName: string;
  assetID: string;
  assetName: string;
  assetType: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  createdDate: Date;
  lastUpdatedDate: Date;
}

export interface CreateTicket {
  assetID: string;
  title: string;
  description?: string;
  priority: string;
}

export interface UpdateTicket {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
}

