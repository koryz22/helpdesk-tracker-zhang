# JPF Help Desk Management Application

A lightweight, full-stack Help Desk Management system built with ASP.NET Core Web API (.NET 9) and Angular 20 with TailwindCSS.

## Project Structure

```
├── api/                   # Backend Directory
│   ├── Controllers/       # API endpoints
│   ├── Models/            # Entity models
│   ├── DTOs/              # Data transfer objects
│   ├── Services/          # Business logic
│   └── Data/              # Database context
├── client/                # Frontend Directory
│   ├── public/            # Public Images
│   ├── src/app/
│   │   ├── components/    # Angular components
│   │   ├── guards/        # Route guards
│   │   ├── interceptors/  # HTTP interceptors
│   │   ├── models/        # TypeScript models
│   │   └── services/      # Angular services
└── README.md
```

## Setup Steps

### Prerequisites
- .NET 9.0.305
- Angular CLI 20.3.6
- Node.js v22.19.0

### Backend Setup
1. Navigate to `api/` directory
2. Check/Update SQL connection string in `appsettings.json`
3. Start backend server: `dotnet run`

### Frontend Setup
1. Navigate to `client/` directory
2. Install dependencies: `npm install`
3. Start frontend client: `ng serve`
4. Open browser to `http://localhost:4200`

## Schema Notes
- **Users**: Authentication and Role Management
  - Added *PasswordHash* column to store user password
  - Added *Role* column for admin / user specific login
- **Assets**: Tracking and Management
  - Added *UserID* foreign key to create assest linkage to user
- **Tickets**: Ticket System with Status Tracking

## Design Rationale
- **Asset-centric Approach**: I built the application around assets because users will most likely open service tickets for those assets.
- **User vs. Admin Roles**: Following the first line of reasoning, it made sense to create users as well as admin roles who will oversee the HelpDesk Application. Users should only see their own assets and tickets for privacy. Admins see everything to provide support — this mirrors real world support ticket systems.

## Estimated Time Spent
- **Deployment**: 5 hrs
- **Frontend**: 3 hr  
- **Backend**: 2 hr
- **Total**: 10 hrs