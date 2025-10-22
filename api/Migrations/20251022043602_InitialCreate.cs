using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HelpDeskApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "Assets",
                columns: table => new
                {
                    AssetID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AssetType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AssetName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UserID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assets", x => x.AssetID);
                    table.ForeignKey(
                        name: "FK_Assets_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    TicketID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AssetID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Priority = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.TicketID);
                    table.ForeignKey(
                        name: "FK_Tickets_Assets_AssetID",
                        column: x => x.AssetID,
                        principalTable: "Assets",
                        principalColumn: "AssetID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tickets_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserID", "Email", "FullName", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "kory@jpf.com", "Kory Zhang", "$2a$11$xRUJGHtE/L0abWvW4gPx2Og.wdHFQqEYIgeQdPjX63oGmB.lvRX/i", "Admin" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "john@jpf.com", "John Doe", "$2a$11$xRUJGHtE/L0abWvW4gPx2Og.wdHFQqEYIgeQdPjX63oGmB.lvRX/i", "User" }
                });

            migrationBuilder.InsertData(
                table: "Assets",
                columns: new[] { "AssetID", "AssetName", "AssetType", "Description", "UserID" },
                values: new object[,]
                {
                    { new Guid("33333333-3333-3333-3333-333333333331"), "San Ramon Residence", "Home", "Primary residence in San Ramon, CA", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("33333333-3333-3333-3333-333333333332"), "Danville Property", "Home", "Secondary property in Danville, CA", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("44444444-4444-4444-4444-444444444441"), "BMW M4", "Vehicle", "2024 BMW M4 Competition", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("44444444-4444-4444-4444-444444444442"), "Lexus IS 500", "Vehicle", "2024 Lexus IS 500 F Sport", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("44444444-4444-4444-4444-444444444443"), "2026 NINJA 650", "Vehicle", "Kawasaki Ninja 650 Motorcycle", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("55555555-5555-5555-5555-555555555551"), "Silver Will", "Personal Property", "Championship racehorse, valued at $2,000,000", new Guid("22222222-2222-2222-2222-222222222222") }
                });

            migrationBuilder.InsertData(
                table: "Tickets",
                columns: new[] { "TicketID", "AssetID", "CreatedDate", "Description", "LastUpdatedDate", "Priority", "Status", "Title", "UserID" },
                values: new object[,]
                {
                    { new Guid("66666666-6666-6666-6666-666666666661"), new Guid("33333333-3333-3333-3333-333333333331"), new DateTime(2025, 10, 16, 21, 36, 2, 96, DateTimeKind.Local).AddTicks(1249), "Annual HVAC maintenance required for San Ramon residence", new DateTime(2025, 10, 16, 21, 36, 2, 96, DateTimeKind.Local).AddTicks(1253), "Medium", "Open", "HVAC System Maintenance", new Guid("22222222-2222-2222-2222-222222222222") },
                    { new Guid("66666666-6666-6666-6666-666666666662"), new Guid("44444444-4444-4444-4444-444444444441"), new DateTime(2025, 10, 19, 21, 36, 2, 96, DateTimeKind.Local).AddTicks(1258), "Scheduled oil change and brake inspection", new DateTime(2025, 10, 20, 21, 36, 2, 96, DateTimeKind.Local).AddTicks(1259), "High", "In Progress", "BMW M4 Oil Change", new Guid("22222222-2222-2222-2222-222222222222") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assets_UserID",
                table: "Assets",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_AssetID",
                table: "Tickets",
                column: "AssetID");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_UserID",
                table: "Tickets",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropTable(
                name: "Assets");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
