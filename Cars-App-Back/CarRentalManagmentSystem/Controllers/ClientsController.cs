using System.Security.AccessControl;
using System.Security.Cryptography;
using System.Text;
using CarRentalManagmentSystem.Data;
using CarRentalManagmentSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarRentalManagmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        public static string publicApiKey = "";
        private readonly AppDbContext _context;
        public ClientsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var users = _context.Clients.ToList();
            foreach (var user in users)
            {
                if (user.Password == request.Password && user.PersonalNumber == request.PersonalNo)
                {
                    var apiKey = GenerateApiKey();
                    publicApiKey = apiKey;
                    return Ok(new { ApiKey = apiKey });
                }
            }

            return Unauthorized("Invalid credentials.");
        }

        public class LoginRequest
        {
            public string PersonalNo { get; set; }
            public string Password { get; set; }
        }

        // Generate a unique API Key
        private string GenerateApiKey()
        {
            using (var sha256 = SHA256.Create())
            {
                var keyData = Guid.NewGuid().ToString();
                var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(keyData));
                return Convert.ToBase64String(hashBytes);
            }
        }
        [HttpGet]
        [Route("GetAll")]
        public IActionResult GetAllClients()
        {
            var clients = _context.Clients.ToList();
            return Ok(clients);
        }
        [HttpPost]
        [Route("Add")]
        public IActionResult AddNewClient([FromBody]Client clientReq)
        {
            var exists = _context.Clients.Any(x => x.PersonalNumber == clientReq.PersonalNumber);
            if (exists)
            {
                return BadRequest("This client already exists!");
            }
            var validate = ValidateClient(clientReq.PersonalNumber,clientReq.DriversLicenseNo,clientReq.Name,clientReq.Surname,clientReq.PersonalNumber);
            if (validate != "Ok")
            {
                return BadRequest(validate);
            }
            
            if (clientReq.Email == null)
            {
                var client_no_mail = new Client { PersonalNumber = clientReq.PersonalNumber, DriversLicenseNo = clientReq.DriversLicenseNo, Name = clientReq.Name, Surname = clientReq.Surname, PhoneNum = clientReq.PhoneNum, Password = clientReq.Password };
                _context.Clients.Add(client_no_mail);
                _context.SaveChanges();
                return Ok(client_no_mail);

            }
            var client = new Client { PersonalNumber = clientReq.PersonalNumber, DriversLicenseNo = clientReq.DriversLicenseNo, Name = clientReq.Name, Surname = clientReq.Surname, PhoneNum = clientReq.PhoneNum, Email = clientReq.Email, Password = clientReq.Password };
            _context.Clients.Add(client);
            _context.SaveChanges();
            return Ok(client);
        }
        [HttpPut]
        [Route("Update/{personalNumber}")]
        public IActionResult UpdateClient(string personalNumber, [FromBody]Client client)
        {
            var existingClient = _context.Clients.FirstOrDefault(x => x.PersonalNumber == personalNumber);
            if (existingClient == null)
            {
                return BadRequest("This client does not exist!");
            }
            var validate = ValidateClient(client.PersonalNumber,client.DriversLicenseNo, client.Name, client.Surname, client.PhoneNum);
            if (validate != "Ok")
            {
                return BadRequest(validate);
            }
            existingClient.Name = client.Name;
            existingClient.Surname = client.Surname;    
            existingClient.Email = client.Email;
            _context.SaveChanges();
            return Ok(existingClient);
        }
        [HttpDelete]
        [Route("Delete/{personalNumber}")]
        public IActionResult DeleteClient(string personalNumber)
        {
            var existingClient = _context.Clients.FirstOrDefault(x => x.PersonalNumber == personalNumber);
            if (existingClient == null)
            {
                return BadRequest("This client does not exist!");
            }
            _context.Clients.Remove(existingClient);
            _context.SaveChanges();
            return Ok(existingClient);
        }
        [HttpGet]
        [Route("find_by_personal_no/{personalNumber}")]
        public IActionResult GetClientByPersonalNumber(string personalNumber)
        {
            try
            {
                var existingClient = _context.Clients.FirstOrDefault(x => x.PersonalNumber == personalNumber);

                // If client does not exist, return a 404 status code with an appropriate error message
                if (existingClient == null)
                {
                    return NotFound(new { message = "This client does not exist!" });
                }

                // Return the client data with a 200 OK status code
                return Ok(existingClient);
            }
            catch (Exception ex)
            {
                // Log exception if necessary
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }


        [HttpGet]
        [Route("find_by_drivers_license_no/{driversLicenseNumber}")]
        public IActionResult GetClientByDriversLicenseNumber(string driversLicenseNumber)
        {
            var existingClient = _context.Clients.FirstOrDefault(x => x.DriversLicenseNo == driversLicenseNumber);
            if (existingClient == null)
            {
                return BadRequest("This client does not exist!");
            }
            return Ok(existingClient);

        }
        private string ValidateClient(string personalNumber, string driversLicenseNo, string name, string surname, string phoneNum)
        {
            if(personalNumber.Length != 10)
            {
                return "Personal Number must be exactly 10 characters long!";
            }
            if (phoneNum.Length != 10)
            {
                return "Phone Number must be exactly 10 characters long!";
            }
            if(driversLicenseNo.Length != 11)
            {
                return "Drivers license number must be exactly 11 characters long!";

            }
            foreach (var ch in name)
            {
                if (char.IsDigit(ch))
                {
                    return "Name cannot contain digits!";
                }
            }
            foreach (var ch in surname)
            {
                if (char.IsDigit(ch))
                {
                    return "Surname cannot contain digits!";
                }
            }
            return "Ok";
        }
    } 
}
