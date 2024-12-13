using CarRentalManagmentSystem.Data;
using CarRentalManagmentSystem.Models.DTO;
using CarRentalManagmentSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Azure.Core;

namespace CarRentalManagmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CarsController(AppDbContext context)
        {
            _context = context;            
        }

        [HttpGet]
        [Route("get_cars")]
        public IActionResult GetAllCars()
        {
            var cars = _context.Cars.ToList();
            if (cars.Any())
            {
                var carsWithImages = cars.Select(car =>
                {
                    // Ensure that the Category is assigned if it is null
                    if (car.Category == null)
                    {
                        car.Category = _context.Categories.FirstOrDefault(x => x.CategoryId == car.CategoryId);
                    }

                    return new
                    {
                        car.Id,
                        car.Model,
                        car.YearProduction,
                        car.DailyPrice,
                        car.PlateNum,
                        car.Category, // This will return the assigned Category
                        Image = car.Photo != null ? Convert.ToBase64String(car.Photo) : null // Assuming 'Image' is a byte array
                    };
                }).ToList(); // Ensure it's evaluated to a list

                return Ok(carsWithImages); // Return the result
            }

            return Ok(new { Message = "There is no car added yet" });
        }


        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> AddCar([FromForm] CarCreateRequest request)
        {
            
            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null)
            {
                return BadRequest("Category does not exist.");
            }
            if(_context.Cars.Any(x => x.PlateNum == request.PlateNum))
            {
                return BadRequest("This plate number already exists!");
            }
            if(request.PlateNum.Length != 7)
            {
                return BadRequest("Plate number must have exactly 7 digits!");

            }
            // Load the photo as byte array
            byte[]? photoData = null;
            if (request.Photo != null)
            {
                using var memoryStream = new MemoryStream();
                await request.Photo.CopyToAsync(memoryStream);
                photoData = memoryStream.ToArray();
            }

            var car = new Car
            {
                Model = request.Model,
                YearProduction = request.YearProduction,
                DailyPrice = request.DailyPrice,
                CategoryId = request.CategoryId,
                Photo = photoData,
                PlateNum = request.PlateNum
            };

            // Add to database
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return Ok(new { car.Id, Message = "Car added successfully" });
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> UpdateCarAsync(int id, [FromForm] CarCreateRequest car)
        {
            var exists = _context.Cars.FirstOrDefault(x => x.Id == id);
            if (exists == null)
            {
                return NotFound("Car was not found!");
            }
            // Load the photo as byte array
            byte[]? photoData = null;
            if (car.Photo != null)
            {
                using var memoryStream = new MemoryStream();
                await car.Photo.CopyToAsync(memoryStream);
                photoData = memoryStream.ToArray();
            }


            exists.Model = car.Model;
            exists.DailyPrice = car.DailyPrice;
            exists.Photo = photoData;
            exists.CategoryId = car.CategoryId;
            _context.SaveChanges();
            return Ok(exists);

        }

        [HttpDelete]
        [Route("delete/{id}")]
        public IActionResult DeleteCar(int id)
        {
            var exists = _context.Cars.FirstOrDefault(x => x.Id == id);
            if (exists == null)
            {
                return NotFound("Car was not found!");
            }
            _context.Remove(exists);
            _context.SaveChanges();
            return Ok(new { Message = $"Car with id {id} was deleted!" });


        }

        [HttpGet]
        [Route("get_by/{plate_nr}")]
        public IActionResult GetCarByPlateNr(string plate_nr)
        {
            var car = _context.Cars.FirstOrDefault(x => x.PlateNum == plate_nr);

            if (car == null)
            {
                return NotFound("Car or photo not found.");
            }
            return Ok(car);
        }

        [HttpGet("get_photo/{id}")]
        public async Task<IActionResult> GetCarPhoto(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null || car.Photo == null)
            {
                return NotFound("Car or photo not found.");
            }

            return File(car.Photo, "image/jpeg"); 
        }

       
        [HttpGet]
        [Route("category_id/{id}")]
        public IActionResult GetCarsOfSameCategory(int id)
        {
            var cars = _context.Cars.Where(x => x.CategoryId == id);
            if(cars.Any())
            {
                return Ok(cars);
            }
            return Ok("There is no cars yet in the list!");
        }


        [HttpGet]
        [Route("category/{name}")]
        public IActionResult GetCarsOfSameCategory(string name)
        {
            var cars = _context.Cars
                .Include(c => c.Category)
                .Where(x => x.Category.CategoryName == name)
                .ToList();
            if (cars.Any())
            {
                return Ok(cars);
            }
            return Ok("There is no cars yet in the list!");
        }


        [HttpGet]
        [Route("cars_same/{model}")]
        public IActionResult GetCarsOfSameModel(string model)
        {
            var cars = _context.Cars.Where(x => x.Model == model);
            if (cars.Any())
            {
                return Ok(cars);
            }
            return Ok("There is no cars yet in the list!");
        }

     

    }
}
