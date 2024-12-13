using System.Linq;
using CarRentalManagmentSystem.Data;
using CarRentalManagmentSystem.Models;
using CarRentalManagmentSystem.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PdfSharpCore;
using PdfSharpCore.Pdf;
using TheArtOfDev.HtmlRenderer.PdfSharp;

namespace CarRentalManagmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ReservationsController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }
        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> CreateReservation([FromForm] ReservationRequest reservation)
        {
            var existingReservation = await _context.Reservations
                .Where(r => r.CarId == reservation.CarId &&
                            ((reservation.StartDate >= r.StartDate && reservation.StartDate < r.EndDate) ||
                             (reservation.EndDate > r.StartDate && reservation.EndDate <= r.EndDate)))
                .FirstOrDefaultAsync();

            if (existingReservation != null)
            {
                return BadRequest("The car is not available for the selected dates.");
            }

            var newReservation = new Reservation
            {
                CarId = reservation.CarId,
                ClientId = reservation.ClientId,
                StartDate = reservation.StartDate,
                EndDate = reservation.EndDate,
                Car = _context.Cars.FirstOrDefault(x => x.Id == reservation.CarId),
                Client = _context.Clients.FirstOrDefault(x => x.PersonalNumber == reservation.ClientId)
            };

            // Add the reservation to the context
            _context.Reservations.Add(newReservation);
            await _context.SaveChangesAsync();

            // Return the reservation ID and any other details for the front-end
            return Ok(new
            {
                message = "Reservation created successfully.",
                reservationId = newReservation.Id
            });
        }


        [HttpGet]
        [Route("get_all")]
        public IActionResult GetAllReservations()
        {
            var reservations = _context.Reservations.ToList();
            var reservationsWithClientAndCars = reservations.Select(reservation => new
            {
                Reservation = reservation,
                Client = _context.Clients.FirstOrDefault(x => x.PersonalNumber == reservation.ClientId),
                Car = _context.Cars.FirstOrDefault(x => x.Id == reservation.CarId)
            }).ToList();

            return Ok(reservationsWithClientAndCars);
        }
        [HttpGet]
        [Route("pdf")]
        public IActionResult GeneratePDF([FromQuery] int reservationId)
        {
            // Fetch the reservation by its ID
            var reservation = _context.Reservations.FirstOrDefault(r => r.Id == reservationId);
            if (reservation == null)
            {
                return NotFound("Reservation not found.");
            }

            // Generate the PDF content
            var document = new PdfDocument();
            string HtmlContent = @$"<h1>Reservation Invoice for {reservation.Id}</h1>";
            PdfGenerator.AddPdfPages(document, HtmlContent, PageSize.A4);

            byte[]? response = null;

            using (MemoryStream ms = new MemoryStream())
            {
                document.Save(ms);
                response = ms.ToArray();
            }

            // Return the PDF with the appropriate Content-Type header
            string fileName = "bill_no_" + reservation.Id + ".pdf";
            return File(response, "application/pdf", fileName);
        }


    }
}
    //[HttpGet]
    //[Route("is_available/{carId}")]
    //public IActionResult IsCarAvailable(int carId, DateTime startDate, DateTime endDate)
    //{

//}



