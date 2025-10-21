using System.ComponentModel.DataAnnotations;

namespace HelpDeskApi.Models
{
    public class User
    {
        [Key]
        public Guid UserID { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = "User"; // 'User' or 'Admin'
        
        // Navigation properties
        public ICollection<Asset> Assets { get; set; } = new List<Asset>();
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}


