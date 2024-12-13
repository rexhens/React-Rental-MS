using System.Security.AccessControl;
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
        private readonly AppDbContext _context;
        public ClientsController(AppDbContext context)
        {
            _context = context;
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
        public IActionResult AddNewClient(string personalNumber,string driversLicenseNo, string name, string surname, string phoneNum, string? email)
        {
            var exists = _context.Clients.Any(x => x.PersonalNumber == personalNumber);
            if (exists)
            {
                return BadRequest("This client already exists!");
            }
            var validate = ValidateClient(personalNumber,driversLicenseNo,name,surname,phoneNum);
            if (validate != "Ok")
            {
                return BadRequest(validate);
            }
            if (string.IsNullOrEmpty(personalNumber) || string.IsNullOrEmpty(name) || string.IsNullOrEmpty(surname) ||
                string.IsNullOrEmpty(phoneNum))
            {
                return BadRequest("Fields cannot be empty!");
            }
            if (email == null)
            {
                var client_no_mail = new Client { PersonalNumber = personalNumber, DriversLicenseNo = driversLicenseNo, Name = name, Surname = surname, PhoneNum = phoneNum };
                _context.Clients.Add(client_no_mail);
                _context.SaveChanges();
                return Ok(client_no_mail);

            }
            var client = new Client { PersonalNumber = personalNumber, DriversLicenseNo = driversLicenseNo, Name = name, Surname = surname, PhoneNum = phoneNum, Email = email };
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
            var existingClient = _context.Clients.FirstOrDefault(x => x.PersonalNumber == personalNumber);
            if (existingClient == null)
            {
                return BadRequest("This client does not exist!");
            }
            return Ok(existingClient);

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
