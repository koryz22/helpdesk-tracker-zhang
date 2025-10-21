using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDeskApi.Models
{
    public class Asset
    {
        [Key]
        public Guid AssetID { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string AssetType { get; set; } = string.Empty; // e.g., Home, Vehicle, Personal Property
        
        [Required]
        [MaxLength(200)]
        public string AssetName { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [Required]
        public Guid UserID { get; set; }
        
        // Navigation properties
        [ForeignKey("UserID")]
        public User User { get; set; } = null!;
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}


