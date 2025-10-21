using HelpDeskApi.Data;
using HelpDeskApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDeskApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDto
                {
                    UserID = u.UserID,
                    FullName = u.FullName,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();
                
            return Ok(users);
        }
    }
}


