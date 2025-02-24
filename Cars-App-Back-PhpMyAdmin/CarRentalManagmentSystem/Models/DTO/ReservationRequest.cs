namespace CarRentalManagmentSystem.Models.DTO
{
    public class ReservationRequest
    {
        public required string ClientId { get; set; }
        public required int CarId { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
    }
}
