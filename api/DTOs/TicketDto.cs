namespace HelpDeskApi.DTOs
{
    public class TicketDto
    {
        public Guid TicketID { get; set; }
        public Guid UserID { get; set; }
        public string UserName { get; set; } = string.Empty;
        public Guid AssetID { get; set; }
        public string AssetName { get; set; } = string.Empty;
        public string AssetType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime LastUpdatedDate { get; set; }
    }
    
    public class CreateTicketDto
    {
        public Guid AssetID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = "Medium";
    }
    
    public class UpdateTicketDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Priority { get; set; }
        public string? Status { get; set; }
    }
}


