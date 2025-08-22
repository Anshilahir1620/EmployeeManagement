using EmployeeManagement.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {

        #region Configuration Fields 
        private readonly HrmanagementContext _context;
        public DepartmentController(HrmanagementContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllDetaild
        [HttpGet]
        public async Task<ActionResult<List<Department>>> GetAllDetaild()
        {
            var departments = await _context.Departments.ToListAsync();
            return Ok(departments);
        }
        #endregion

        #region GetByDepartmentID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByDepartmentID(int id)
        {

            var Department = await _context.Departments.FindAsync(id);
            if (Department == null)
            {
                return NotFound();
            }

            return Ok(Department);


        }
        #endregion

        #region DeleteById
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteByID(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
            {
                return NotFound();
            }
            _context.Departments.Remove(department);
           await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion

        #region Insert Department
        [HttpPost]
        public async Task<IActionResult> InsertDepartment([FromBody] Department department)
        {

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
            return NoContent();


        }
        #endregion


        #region Update Department
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] Department department)
        {

            var existingDepartment = await _context.Departments.FindAsync(id);
            if (existingDepartment == null)
            {
                return NotFound();
            }

            existingDepartment.DeptName = department.DeptName;
            existingDepartment.Description = department.Description;
            existingDepartment.CreatedAt = department.CreatedAt;
            existingDepartment.ModifiedDate = department.ModifiedDate;

            _context.Departments.Update(existingDepartment);
            await _context.SaveChangesAsync();

            return NoContent();

        }
        #endregion

    }
}
