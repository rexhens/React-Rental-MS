using System.ComponentModel.DataAnnotations;

namespace CarRentalManagmentSystem.Models.DTO
{
    public class CarCreateRequest
    {
        [Required]
        public string Model { get; set; } = string.Empty;

        [Required]
        [Range(1886, int.MaxValue, ErrorMessage = "Year of production must be valid.")]
        public int YearProduction { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Daily price must be non-negative.")]
        public double DailyPrice { get; set; }

        [Required]
        public int CategoryId { get; set; }

        // Optional photo
        public IFormFile? Photo { get; set; }
        public required string PlateNum { get; set; }

    }

}
