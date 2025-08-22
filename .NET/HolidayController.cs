using EmployeeManagement.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HolidayController : ControllerBase
    {
        #region Configuration Fields 
        private readonly HrmanagementContext _context;
        public HolidayController(HrmanagementContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllLeavedetail

        [HttpGet]
        public async Task<ActionResult<List<Holiday>>> GetAllDetails()
        {
            var Holiday = await _context.Holidays.ToListAsync();
            return Ok(Holiday);
        }
        #endregion

        #region GetById
        [HttpGet("{id}")]
        public async Task<ActionResult<Holiday>> GetByID(int id)
        {
            var holiday = await _context.Holidays.FindAsync(id);
            if (holiday == null)
            {
                return NotFound();
            }

            return Ok(holiday);
        }


        #endregion

        #region DeleteById
        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Holiday>>> DeleteByID(int id)
        {
            var Holiday = await _context.Holidays.FindAsync(id);
            if (Holiday == null)
            {
                return NotFound();
            }
            _context.Holidays.Remove(Holiday);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion


        #region Insert holiday
        [HttpPost]
        public async Task<ActionResult<List<Holiday>>> InsertHoliday([FromBody] Holiday holiday)
        {
            //var validationResult = await _validator.ValidateAsync(employee);
            //if (!validationResult.IsValid)
            //{
            //    return BadRequest(validationResult.Errors.Select(e => new
            //    {
            //        Property = e.PropertyName,
            //        Error = e.ErrorMessage
            //    }));
            //}
            //    ;
            _context.Holidays.Add(holiday);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion


        #region Update Holiday 
        [HttpPut("{id}")]
        public async Task<ActionResult<List<Employee>>> UpdateHoliday(int id, [FromBody] Holiday holiday)
        {
            if (id != holiday.HolidayId)
            {
                return BadRequest("ID mismatch");
            }
            var exisitingHoliday = await _context.Holidays.FindAsync(id);
            if (exisitingHoliday == null)
            {
                return NotFound();
            }
            exisitingHoliday.HolidayName = holiday.HolidayName;
            exisitingHoliday.Date = holiday.Date;
            exisitingHoliday.Type = holiday.Type;
            exisitingHoliday.CreatedAt = holiday.CreatedAt;
            exisitingHoliday.ModifiedDate = holiday.ModifiedDate;


            _context.Holidays.Update(exisitingHoliday);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion


        #region Drop Down
        [HttpGet("HolidayType")]
        public IActionResult GetHolidayTypeOptions()
        {
            var statusOptions = new List<string>
        {
            "Public",
            "Optional",
            "Religious"
        };

            return Ok(statusOptions);
        }
        #endregion


    }
}
