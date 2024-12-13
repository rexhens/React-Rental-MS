using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CarRentalManagmentSystem.Models
{
    public class Reservation
    {
        [Column("ReservationId")]
        public int Id { get; set; }
        public required string ClientId {  get; set; }
        public required int CarId {  get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
        public Car? Car { get; set; }
        public Client? Client { get; set; }
    }
}
