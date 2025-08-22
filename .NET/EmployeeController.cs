using EmployeeManagement.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class EmployeeController : ControllerBase
    {
        #region Configuration Fields 
        private readonly HrmanagementContext _context;
        private readonly IValidator<Employee> _validator;
        public EmployeeController(HrmanagementContext context , IValidator<Employee> validator)
        {
            _context = context;
            _validator = validator;
        }
        #endregion

        #region GetAllEmployees 
        [HttpGet]
        public async Task<ActionResult<List<Employee>>> GetAllEmployees()
        {
            var employees = await _context.Employees.ToListAsync();
            return Ok(employees);
        }


        #endregion

        #region GetByIdEmployee
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetByIDEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }


        #endregion


        #region FIlter
        [HttpGet("Filter")]
        public async Task<ActionResult<List<MstUser>>> DataFilter(
            [FromQuery] int? EmployeeId,
            [FromQuery] int? UserId,
            [FromQuery] int? DepartmentId,
            [FromQuery] int? CategoryId )
        {
            var query = _context.Employees.AsQueryable();
            if (EmployeeId.HasValue)
            {
                query = query.Where(e => e.EmployeeId == EmployeeId.Value);
            }
            if (UserId.HasValue)
            {
                query = query.Where(e => e.UserId == UserId.Value);
            }
            if (DepartmentId.HasValue)
            {
                query = query.Where(e => e.DepartmentId == DepartmentId.Value);
            }
            if (CategoryId.HasValue)
            {
                query = query.Where(e => e.CategoryId == CategoryId.Value);
            }
            return Ok(query);


        }
        #endregion

        #region DropDown
        [HttpGet("dropdown")]
        public async Task<ActionResult<List<Employee>>> DropDown()
        {
            var Employee = await _context.Employees
            .Select(u => new
            {
                u.EmployeeId,
                u.Name
            })
            .ToListAsync();

            return Ok(Employee);
        }
        #endregion


        #region DeleteById
        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Employee>>> DeleteByIDEmployee(int id)
        {
            var employee =  await _context.Employees.FindAsync(id);
            if(employee == null)
            {
                return NotFound();
            }
            _context.Employees.Remove(employee);
           await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion


        #region Insert Employee
        [HttpPost]
        public async Task<ActionResult<List<Employee>>> InsertEmployee([FromBody]Employee employee)
        {
            var validationResult = await _validator.ValidateAsync(employee);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(e => new
                {
                    Property = e.PropertyName,
                    Error = e.ErrorMessage
                }));
            }
                ;
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion

        #region Update Employee 
        [HttpPut("{id}")]
        public async Task<ActionResult<List<Employee>>> UpdateEmployee(int id, [FromBody] Employee employee)
        {
            if (id != employee.EmployeeId)
            {
                return BadRequest("Employee ID mismatch");
            }
            var exisitingEmployee = await _context.Employees.FindAsync(id);
            if(exisitingEmployee == null)
            {
                return NotFound();
            }
            exisitingEmployee.Name = employee.Name;
            exisitingEmployee.Email = employee.Email;
            exisitingEmployee.PhoneNumber = employee.PhoneNumber;
            exisitingEmployee.DepartmentId = employee.DepartmentId;
            exisitingEmployee.CategoryId = employee.CategoryId;
            exisitingEmployee.Role = employee.Role;
            exisitingEmployee.ModifiedDate = DateTime.Now;
            exisitingEmployee.UserId = employee.UserId;
            
            _context.Employees.Update(exisitingEmployee);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion

    }
}
