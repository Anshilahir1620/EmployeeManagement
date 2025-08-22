using EmployeeManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class LeaveController : ControllerBase
    {
        #region Configuration Fields 
        private readonly HrmanagementContext _context;
        public LeaveController(HrmanagementContext context)
        {
            _context = context;
        }
        #endregion


        #region GetAllLeavedetail
        [HttpGet]
        public async Task<ActionResult<List<Leave>>> GetAllDetails()
        {
            var Leave = await _context.Leaves.ToListAsync();
            return Ok(Leave);
        }
        #endregion

        #region GetById
        [HttpGet("{id}")]
        public async Task<ActionResult<Leave>> GetByID(int id)
        {
            var leave = await _context.Leaves.FindAsync(id);
            if (leave == null)
            {
                return NotFound();
            }

            return Ok(leave);
        }


        #endregion

        #region DeleteById
        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Leave>>> DeleteByID(int id)
        {
            var Leave = await _context.Leaves.FindAsync(id);
            if (Leave == null)
            {
                return NotFound();
            }
            _context.Leaves.Remove(Leave);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion

        #region Insert Leave
        [HttpPost]
        public async Task<ActionResult<List<Leave>>> InsertLeave([FromBody] Leave leave)
        {
            
            _context.Leaves.Add(leave);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion

        #region Update leave 
        [HttpPut("{id}")]
        public async Task<ActionResult<List<Leave>>> UpdateLeave(int id, [FromBody] Leave leave)
        {
            if (id != leave.LeaveId)
            {
                return BadRequest("ID mismatch");
            }
            var exisitingLeave = await _context.Leaves.FindAsync(id);
            if (exisitingLeave == null)
            {
                return NotFound();
            }
            exisitingLeave.StartDate = leave.StartDate;
            exisitingLeave.EndDate = leave.EndDate;
            exisitingLeave.Remark = leave.Remark;
            exisitingLeave.Status = leave.Status;
            exisitingLeave.AppliedOn = leave.AppliedOn;
            exisitingLeave.ApprovedBy = leave.ApprovedBy;
            exisitingLeave.CreatedAt = leave.CreatedAt;
            exisitingLeave.ModifiedDate = leave.ModifiedDate;

            _context.Leaves.Update(exisitingLeave);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion


        #region Drop Down
        [HttpGet("LeaveStatus")]
        public IActionResult GetLeaveStatusOptions()
        {
            var statusOptions = new List<string>
        {
            "Pending",
            "Approved",
            "Rejected"
        };

            return Ok(statusOptions);
        }
        #endregion
    }
}
