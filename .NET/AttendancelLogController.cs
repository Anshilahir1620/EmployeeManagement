using EmployeeManagement.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendancelLogController : ControllerBase
    {
        #region Configuration Fields 
        private readonly HrmanagementContext _context;
        public AttendancelLogController(HrmanagementContext context)
        {
            _context = context;
        }
        #endregion


        #region GetAllAttendanceLogs
        [HttpGet]
        public async Task<ActionResult<List<AttendanceLog>>> GetAllAttendanceLog()
        {
            var AttendanceLogs = await _context.AttendanceLogs.ToListAsync();
            return Ok(AttendanceLogs);
        }
        #endregion

        #region DeleteById
        [HttpDelete("{id}")]
        public async Task<ActionResult<List<AttendanceLog>>> DeleteByID(int id)
        {
            var attendanceLog = await _context.AttendanceLogs.FindAsync(id);
            if (attendanceLog == null)
            {
                return NotFound();
            }
            _context.AttendanceLogs.Remove(attendanceLog);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion


        #region GetByIdAttendance
        [HttpGet("{id}")]
        public async Task<ActionResult<AttendancelLogController>> GetByIDAttendaceLog(int id)
        {
            var User = await _context.AttendanceLogs.FindAsync(id);
            if (User == null)
            {
                return NotFound();
            }

            return Ok(User);
        }


        #endregion

        #region Insert Employee Attendace
        [HttpPost]
        public async Task<ActionResult<List<AttendanceLog>>> InsertAttendace([FromBody] AttendanceLog attendance)
        {
            _context.AttendanceLogs.Add(attendance);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion


        #region Update Attendace    
        [HttpPut("{id}")]
        public async Task<ActionResult<List<AttendanceLog>>> UpdateEmployee(int id, [FromBody] AttendanceLog attendance)
        {
            if (id != attendance.AttendanceLogId)
            {
                return BadRequest("Attendace ID mismatch");
            }
            var exisitingEmployee = await _context.AttendanceLogs.FindAsync(id);
            if (exisitingEmployee == null)
            {
                return NotFound();
            }
            exisitingEmployee.UserId = attendance.UserId;
            exisitingEmployee.Date = attendance.Date;
            exisitingEmployee.PunchIn = attendance.PunchIn;
            exisitingEmployee.PunchOut = attendance.PunchOut; 
            exisitingEmployee.TotalHours = attendance.TotalHours;
            exisitingEmployee.Status = attendance.Status;
            exisitingEmployee.Remarks = attendance.Remarks;
            exisitingEmployee.CreatedAt = attendance.CreatedAt;
            exisitingEmployee.ModifiedDate = attendance.ModifiedDate;

            _context.AttendanceLogs.Update(exisitingEmployee);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion




        #region Drop Down
        [HttpGet("status")]
        public IActionResult GetStatusOptions()
        {
            var statusOptions = new List<string>
        {
            "Present",
            "Half-day",
            "Absent"
        };

            return Ok(statusOptions);
        }
        #endregion


    }
}
