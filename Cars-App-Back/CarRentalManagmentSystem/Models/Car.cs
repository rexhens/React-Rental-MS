using System.ComponentModel.DataAnnotations.Schema;

namespace CarRentalManagmentSystem.Models
{
    public class Car
    {
        [Column("CarId")]
        public int Id { get; set; }

        [Column("CarModel")]
        public required string Model { get; set; }
        public int YearProduction { get; set; }
        public double DailyPrice {  get; set; }
        public int CategoryId { get; set; }
        public Category? Category { get; set; } 

        [Column("ImgBinary")]
        public byte[]? Photo { get; set; } 
        public required string PlateNum { get; set; }
    }
}
