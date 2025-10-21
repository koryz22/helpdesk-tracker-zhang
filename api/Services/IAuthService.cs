using HelpDeskApi.DTOs;

namespace HelpDeskApi.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
        string GenerateJwtToken(Guid userId, string email, string role);
    }
}


