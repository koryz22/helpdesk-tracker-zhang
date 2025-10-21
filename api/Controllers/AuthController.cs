using HelpDeskApi.DTOs;
using HelpDeskApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace HelpDeskApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            
            if (result == null)
                return Unauthorized(new { message = "Invalid email or password" });
                
            return Ok(result);
        }
    }
}


