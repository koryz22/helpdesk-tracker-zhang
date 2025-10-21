using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDeskApi.Models
{
    public class Ticket
    {
        [Key]
        public Guid TicketID { get; set; }
        
        [Required]
        public Guid UserID { get; set; }
        
        [Required]
        public Guid AssetID { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Priority { get; set; } = "Medium"; // Low, Medium, High
        
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Open"; // Open, In Progress, Resolved, Closed
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        
        public DateTime LastUpdatedDate { get; set; } = DateTime.Now;
        
        // Navigation properties
        [ForeignKey("UserID")]
        public User User { get; set; } = null!;
        
        [ForeignKey("AssetID")]
        public Asset Asset { get; set; } = null!;
    }
}


