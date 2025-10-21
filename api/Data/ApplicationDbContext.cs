using Microsoft.EntityFrameworkCore;
using HelpDeskApi.Models;

namespace HelpDeskApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure relationships
            modelBuilder.Entity<Asset>()
                .HasOne(a => a.User)
                .WithMany(u => u.Assets)
                .HasForeignKey(a => a.UserID)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.User)
                .WithMany(u => u.Tickets)
                .HasForeignKey(t => t.UserID)
                .OnDelete(DeleteBehavior.NoAction);
                
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Asset)
                .WithMany(a => a.Tickets)
                .HasForeignKey(t => t.AssetID)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Seed data
            SeedData(modelBuilder);
        }
        
        private void SeedData(ModelBuilder modelBuilder)
        {
            // Password: "Password123"
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("Password123");
            
            // Create users
            var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var userId = Guid.Parse("22222222-2222-2222-2222-222222222222");
            
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserID = adminId,
                    FullName = "Kory Zhang",
                    Email = "kory@jpf.com",
                    PasswordHash = passwordHash,
                    Role = "Admin"
                },
                new User
                {
                    UserID = userId,
                    FullName = "John Doe",
                    Email = "john@jpf.com",
                    PasswordHash = passwordHash,
                    Role = "User"
                }
            );
            
            // Create assets
            var home1Id = Guid.Parse("33333333-3333-3333-3333-333333333331");
            var home2Id = Guid.Parse("33333333-3333-3333-3333-333333333332");
            var bmwId = Guid.Parse("44444444-4444-4444-4444-444444444441");
            var lexusId = Guid.Parse("44444444-4444-4444-4444-444444444442");
            var ninjaId = Guid.Parse("44444444-4444-4444-4444-444444444443");
            var horseId = Guid.Parse("55555555-5555-5555-5555-555555555551");
            
            modelBuilder.Entity<Asset>().HasData(
                new Asset
                {
                    AssetID = home1Id,
                    AssetType = "Home",
                    AssetName = "San Ramon Residence",
                    Description = "Primary residence in San Ramon, CA",
                    UserID = userId
                },
                new Asset
                {
                    AssetID = home2Id,
                    AssetType = "Home",
                    AssetName = "Danville Property",
                    Description = "Secondary property in Danville, CA",
                    UserID = userId
                },
                new Asset
                {
                    AssetID = bmwId,
                    AssetType = "Vehicle",
                    AssetName = "BMW M4",
                    Description = "2024 BMW M4 Competition",
                    UserID = userId
                },
                new Asset
                {
                    AssetID = lexusId,
                    AssetType = "Vehicle",
                    AssetName = "Lexus IS 500",
                    Description = "2024 Lexus IS 500 F Sport",
                    UserID = userId
                },
                new Asset
                {
                    AssetID = ninjaId,
                    AssetType = "Vehicle",
                    AssetName = "2026 NINJA 650",
                    Description = "Kawasaki Ninja 650 Motorcycle",
                    UserID = userId
                },
                new Asset
                {
                    AssetID = horseId,
                    AssetType = "Personal Property",
                    AssetName = "Silver Will",
                    Description = "Championship racehorse, valued at $2,000,000",
                    UserID = userId
                }
            );
            
            // Create sample tickets
            modelBuilder.Entity<Ticket>().HasData(
                new Ticket
                {
                    TicketID = Guid.Parse("66666666-6666-6666-6666-666666666661"),
                    UserID = userId,
                    AssetID = home1Id,
                    Title = "HVAC System Maintenance",
                    Description = "Annual HVAC maintenance required for San Ramon residence",
                    Priority = "Medium",
                    Status = "Open",
                    CreatedDate = DateTime.Now.AddDays(-5),
                    LastUpdatedDate = DateTime.Now.AddDays(-5)
                },
                new Ticket
                {
                    TicketID = Guid.Parse("66666666-6666-6666-6666-666666666662"),
                    UserID = userId,
                    AssetID = bmwId,
                    Title = "BMW M4 Oil Change",
                    Description = "Scheduled oil change and brake inspection",
                    Priority = "High",
                    Status = "In Progress",
                    CreatedDate = DateTime.Now.AddDays(-2),
                    LastUpdatedDate = DateTime.Now.AddDays(-1)
                }
            );
        }
    }
}


