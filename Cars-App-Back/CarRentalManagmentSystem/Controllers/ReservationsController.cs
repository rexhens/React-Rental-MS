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
            var apiKey = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(apiKey) || !IsValidApiKey(apiKey))
            {
                return Unauthorized("Invalid API key");
            }
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

        private bool IsValidApiKey(string apiKey)
        {
            if (apiKey != ClientsController.publicApiKey)
            {
                return false;
            }
            return true;
        }

        [HttpGet]
        [Route("get_all")]
        public IActionResult GetAllReservations()
        {
            var apiKey = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(apiKey) || !IsValidApiKey(apiKey))
            {
                return Unauthorized("Invalid API key");
            }
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
            var res = _context.Reservations.FirstOrDefault(r => r.Id == reservationId);
            if (res == null)
            {
                return NotFound("Reservation not found.");
            }

            var reservation = new Reservation
            {
                CarId = res.CarId,
                ClientId = res.ClientId,
                StartDate = res.StartDate,
                EndDate = res.EndDate,
                Car = _context.Cars.FirstOrDefault(x => x.Id == res.CarId),
                Client = _context.Clients.FirstOrDefault(x => x.PersonalNumber == res.ClientId)
            };

            if (reservation.Car == null || reservation.Client == null)
            {
                return NotFound("Car or Client data missing.");
            }

            // Perform calculations
            var days = (reservation.EndDate - reservation.StartDate).Days;
            var totalCost = days * reservation.Car.DailyPrice;
            var currentDate = DateTime.Now.ToString("yyyy-MM-dd");

            // Generate the HTML content for the PDF
            string htmlContent = GenerateHtmlContent(reservation, days, totalCost, currentDate);

            // Generate the PDF document
            var document = new PdfDocument();
            PdfGenerator.AddPdfPages(document, htmlContent, PageSize.A4);

            byte[] response = null;
            using (var ms = new MemoryStream())
            {
                document.Save(ms);
                response = ms.ToArray();
            }

            // Return the PDF file with the appropriate Content-Type header
            string fileName = $"invoice_{reservation.Id}.pdf";
            return File(response, "application/pdf", fileName);
        }
        private string GenerateHtmlContent(Reservation reservation, int days, double totalCost, string currentDate)
        {
            return @$"
<html>
    <head>
        <meta charset=""utf-8"">
        <title>Invoice</title>
    </head>
    <body>
     
        <article>
            <h2>Car Rental Contract</h2>
            <address>
                <p>RentAL Car Company<br>c/o {reservation.Client.Name} {reservation.Client.Surname}</p>
            </address>

            <!-- Invoice Meta Information -->
            <table>
                <tr>
                    <th>Invoice no #</th>
                    <td>{reservation.Id}</td>
                </tr>
                <tr>
                    <th>Date</th>
                    <td>{currentDate}</td>
                </tr>
                <tr>
                    <th>Total</th>
                    <td>$ {totalCost.ToString("0.00")}</td>
                </tr>
            </table>

            <!-- Item Details -->
            <h2>Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Description</th>
                        <th>Number of Days</th>
                        <th>Daily Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Car Rent</td>
                        <td>Experience Review</td>
                        <td>{days}</td>
                        <td>$ {reservation.Car.DailyPrice.ToString("0.00")}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Balance Information -->
            <h2>Balance</h2>
            <table>
                <tr>
                    <th>Total</th>
                    <td>$ {totalCost.ToString("0.00")}</td>
                </tr>
                <tr>
                    <th>Amount Paid</th>
                    <td>$ 0.00</td>
                </tr>
                <tr>
                    <th>Balance Due</th>
                    <td>$ {totalCost.ToString("0.00")}</td>
                </tr>
            </table>
        </article>

        <!-- Additional Notes -->
        <aside>
            <h2>Additional Notes</h2>
            <p>A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
        </aside>
    </body>
</html>
";
        }


    }
}
//[HttpGet]
//[Route("is_available/{carId}")]
//public IActionResult IsCarAvailable(int carId, DateTime startDate, DateTime endDate)
//{

//}
