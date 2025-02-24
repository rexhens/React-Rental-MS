namespace CarRentalManagmentSystem.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public required byte[] ImageData { get; set; }
        public string? ContentType { get; set; } // e.g., "image/jpeg"
    }

}
