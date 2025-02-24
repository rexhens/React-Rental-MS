using CarRentalManagmentSystem.Data;
using CarRentalManagmentSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarRentalManagmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("getAll")]
        public IActionResult GetAllCategories()
        {
            var categories = _context.Categories.ToList();
            if (!categories.Any())
            {
                return BadRequest("There isn't any car category!");
            }
            return Ok(categories);
        }

        [HttpPost]
        [Route("Add")]
        public IActionResult AddNewCategory(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest("Category name cannot be null!");
            }
            string validate = ValidateCategory(name);
            if (validate != "Ok")
            {
                return BadRequest(validate);
            }
            _context.Add(new Category { CategoryName = name });
            _context.SaveChanges();
            return Ok(name);
        }
        [HttpDelete]
        [Route("delete/{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var category = _context.Categories.FirstOrDefault(x => x.CategoryId == id);
            if (category == null)
            {
                return BadRequest("This category does not exist!");
            }
            _context.Categories.Remove(category);
            _context.SaveChanges();
            return Ok(category);

        }
        [HttpGet]
        [Route("get/{id}")]
        public IActionResult GetCategory(int id)
        {
            var category = _context.Categories.FirstOrDefault(x => x.CategoryId == id);
            if (category == null)
            {
                return BadRequest("This category does not exist!");
            }
            return Ok(category);
        }
        [HttpGet]
        [Route("getByName/{name}")]
        public IActionResult GetCategory(string name)
        {
            var category = _context.Categories.FirstOrDefault(x => x.CategoryName == name);
            if (category == null)
            {
                return BadRequest("This category does not exist!");
            }
            return Ok(category);
        }
        private string ValidateCategory(string category)
        {
            if (category == null)
            {
                return "Category must have a name!";
            }
            var exists = _context.Categories.Any(x => x.CategoryName == category);
            if (exists)
            {
                return "This category exists!";
            }
            return "Ok";
        }
    }
}
