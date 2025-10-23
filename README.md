# JPF Help Desk Management Application

A lightweight, full-stack Help Desk Management system built with ASP.NET Core Web API (.NET 9) and Angular 20 with TailwindCSS.

## Project Structure

```
├── api/                    # Backend API
│   ├── Controllers/        # API endpoints
│   ├── Models/            # Entity models
│   ├── DTOs/              # Data transfer objects
│   ├── Services/          # Business logic
│   └── Data/              # Database context
├── client/                # Frontend Angular app
│   ├── src/app/
│   │   ├── components/    # Angular components
│   │   ├── services/      # Angular services
│   │   ├── models/        # TypeScript models
│   │   └── guards/        # Route guards
└── README.md
```

## Key Technologies

- **Backend**: ASP.NET Core, Entity Framework Core, JWT Authentication
- **Frontend**: Angular 20, TypeScript, TailwindCSS
- **Database**: SQL Server
- **Security**: BCrypt password hashing

## Setup Steps

### Prerequisites
- .NET 9 SDK
- Angular CLI
- Node.js (v18 or higher)

### Backend Setup
1. Navigate to `api/` directory
2. Check/Update SQL connection string in `appsettings.json`
3. Run migrations: `dotnet ef database update`
4. Start the API: `dotnet run`

### Frontend Setup
1. Navigate to `client/` directory
2. Install dependencies: `npm install`
3. Start development server: `ng serve`
4. Open browser to `http://localhost:4200`

## Schema Notes

- **Users**: Authentication and role management
  - Added *PasswordHash* column to store user password
  - Added *Role* column for admin / user specific login
- **Assets**: IT asset tracking and management
  - Added *UserID* foreign key to create assest linkage to user
- **Tickets**: Support ticket system with status tracking

## Design Rationale

- **Separation of Concerns**: Clear separation between frontend and backend
- **RESTful API**: Standard HTTP methods and status codes
- **Security First**: JWT authentication with password hashing
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Scalable Architecture**: Modular components and services

## Estimated Time Spent
- **Deployment**: 5 hrs
- **Frontend**: 3 hr  
- **Backend**: 2 hr
- **Total**: 10 hrs