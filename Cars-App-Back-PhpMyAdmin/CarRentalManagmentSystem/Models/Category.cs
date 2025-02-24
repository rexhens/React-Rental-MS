using System.ComponentModel.DataAnnotations;

namespace CarRentalManagmentSystem.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        public required string CategoryName { get; set; }
    }
}
