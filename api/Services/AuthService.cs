using HelpDeskApi.Data;
using HelpDeskApi.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HelpDeskApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        
        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        
        public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);
                
            if (user == null)
                return null;
                
            // Verify password
            bool isValidPassword = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isValidPassword)
                return null;
                
            // Generate token
            var token = GenerateJwtToken(user.UserID, user.Email, user.Role);
            
            return new LoginResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    UserID = user.UserID,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role
                }
            };
        }
        
        public string GenerateJwtToken(Guid userId, string email, string role)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];
            var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"] ?? "1440");
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
                signingCredentials: credentials
            );
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}


