namespace HelpDeskApi.DTOs
{
    public class AssetDto
    {
        public Guid AssetID { get; set; }
        public string AssetType { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid UserID { get; set; }
        public string? UserName { get; set; }
    }
    
    public class CreateAssetDto
    {
        public string AssetType { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid UserID { get; set; }
    }
}


