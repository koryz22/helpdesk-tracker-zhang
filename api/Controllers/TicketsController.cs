using HelpDeskApi.Data;
using HelpDeskApi.DTOs;
using HelpDeskApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HelpDeskApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            IQueryable<Ticket> query = _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Asset);
            
            // If user is not admin, only return their tickets
            if (userRole != "Admin" && !string.IsNullOrEmpty(userIdClaim))
            {
                query = query.Where(t => t.UserID == Guid.Parse(userIdClaim));
            }
            
            var tickets = await query
                .Select(t => new TicketDto
                {
                    TicketID = t.TicketID,
                    UserID = t.UserID,
                    UserName = t.User.FullName,
                    AssetID = t.AssetID,
                    AssetName = t.Asset.AssetName,
                    AssetType = t.Asset.AssetType,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    CreatedDate = t.CreatedDate,
                    LastUpdatedDate = t.LastUpdatedDate
                })
                .OrderByDescending(t => t.CreatedDate)
                .ToListAsync();
                
            return Ok(tickets);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(Guid id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var ticket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Asset)
                .Where(t => t.TicketID == id)
                .Select(t => new TicketDto
                {
                    TicketID = t.TicketID,
                    UserID = t.UserID,
                    UserName = t.User.FullName,
                    AssetID = t.AssetID,
                    AssetName = t.Asset.AssetName,
                    AssetType = t.Asset.AssetType,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    CreatedDate = t.CreatedDate,
                    LastUpdatedDate = t.LastUpdatedDate
                })
                .FirstOrDefaultAsync();
                
            if (ticket == null)
                return NotFound();
                
            // Check if user is authorized to view this ticket
            if (userRole != "Admin" && ticket.UserID.ToString() != userIdClaim)
                return Forbid();
                
            return Ok(ticket);
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto ticketDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();
                
            var userId = Guid.Parse(userIdClaim);
            
            // Verify the asset belongs to the user
            var asset = await _context.Assets.FindAsync(ticketDto.AssetID);
            if (asset == null)
                return BadRequest(new { message = "Asset not found" });
                
            if (asset.UserID != userId)
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                if (userRole != "Admin")
                    return Forbid();
            }
            
            var ticket = new Ticket
            {
                TicketID = Guid.NewGuid(),
                UserID = userId,
                AssetID = ticketDto.AssetID,
                Title = ticketDto.Title,
                Description = ticketDto.Description,
                Priority = ticketDto.Priority,
                Status = "Open",
                CreatedDate = DateTime.Now,
                LastUpdatedDate = DateTime.Now
            };
            
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            
            // Return the created ticket with navigation properties
            var createdTicket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Asset)
                .Where(t => t.TicketID == ticket.TicketID)
                .Select(t => new TicketDto
                {
                    TicketID = t.TicketID,
                    UserID = t.UserID,
                    UserName = t.User.FullName,
                    AssetID = t.AssetID,
                    AssetName = t.Asset.AssetName,
                    AssetType = t.Asset.AssetType,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    CreatedDate = t.CreatedDate,
                    LastUpdatedDate = t.LastUpdatedDate
                })
                .FirstAsync();
            
            return CreatedAtAction(nameof(GetTicket), new { id = ticket.TicketID }, createdTicket);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(Guid id, [FromBody] UpdateTicketDto updateDto)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return NotFound();
                
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Check if user is authorized to update this ticket
            if (userRole != "Admin" && ticket.UserID.ToString() != userIdClaim)
                return Forbid();
            
            // Update fields if provided
            if (!string.IsNullOrEmpty(updateDto.Title))
                ticket.Title = updateDto.Title;
                
            if (updateDto.Description != null)
                ticket.Description = updateDto.Description;
                
            if (!string.IsNullOrEmpty(updateDto.Priority))
                ticket.Priority = updateDto.Priority;
                
            if (!string.IsNullOrEmpty(updateDto.Status))
                ticket.Status = updateDto.Status;
                
            ticket.LastUpdatedDate = DateTime.Now;
            
            await _context.SaveChangesAsync();
            
            // Return updated ticket
            var updatedTicket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Asset)
                .Where(t => t.TicketID == id)
                .Select(t => new TicketDto
                {
                    TicketID = t.TicketID,
                    UserID = t.UserID,
                    UserName = t.User.FullName,
                    AssetID = t.AssetID,
                    AssetName = t.Asset.AssetName,
                    AssetType = t.Asset.AssetType,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    CreatedDate = t.CreatedDate,
                    LastUpdatedDate = t.LastUpdatedDate
                })
                .FirstAsync();
            
            return Ok(updatedTicket);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(Guid id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return NotFound();
                
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Check if user is authorized to delete this ticket
            if (userRole != "Admin" && ticket.UserID.ToString() != userIdClaim)
                return Forbid();
            
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}


