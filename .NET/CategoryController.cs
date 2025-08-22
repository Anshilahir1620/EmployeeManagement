using EmployeeManagement.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Darshan university 

    public class CategoryController : ControllerBase
    {
        #region Configuration Fields 
        private readonly HrmanagementContext _context;

        public CategoryController(HrmanagementContext context)
        {
            _context = context;
        }
        #endregion

        #region GET All Detaild 
        [HttpGet]
        public async Task<ActionResult<List<Category>>> GetAllDetaild()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }
        #endregion

        #region DeleteById
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteByID(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion

        #region GetByCategoryID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByCategoryID(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }
        #endregion

        #region Insert Category
        [HttpPost]
        public async Task<IActionResult> InsertCategory([FromBody] Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion

        #region Update Category
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            var existingCategory = await _context.Categories.FindAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.CategoryName = category.CategoryName;
            existingCategory.Description = category.Description;
            existingCategory.CreatedAt = category.CreatedAt;
            existingCategory.ModifiedDate = category.ModifiedDate;

            _context.Categories.Update(existingCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion  
        //#region Filter Category
        //[HttpGet("Filter")]
        //public async Task<IActionResult> DataFilter(
        //    [FromQuery] int? CategoryId,
        //    [FromQuery] string? Description)
        //{
        //    var query = _context.Categories.AsQueryable();

        //    if (CategoryId.HasValue)
        //    {
        //        query = query.Where(e => e.CategoryId == CategoryId.Value);
        //    }

        //    if (!string.IsNullOrEmpty(Description))
        //    {
        //        query = query.Where(e => e.Description.Contains(Description));
        //    }

        //    var result = await query.ToListAsync();
        //    return Ok(result);
        //}
        //#endregion
    }
}
