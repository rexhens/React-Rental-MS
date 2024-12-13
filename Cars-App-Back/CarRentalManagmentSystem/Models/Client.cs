using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CarRentalManagmentSystem.Models
{
    public class Client
    {
        [Key]
        public required string PersonalNumber { get; set; }
        [Column("ClientName")]
        public required string Name { get; set; }
        [Column("ClientSurname")]
        public required string Surname { get; set; }
        [Column("CelNumber")]
        public required string PhoneNum { get; set; }
        public required string DriversLicenseNo { get; set; }
        [Column("MailAdress")]
        public string? Email { get; set; }

    }
}
