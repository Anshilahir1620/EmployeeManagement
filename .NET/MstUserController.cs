using EmployeeManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MstUserController : ControllerBase
    {
        #region Configuration Fields 
        private readonly HrmanagementContext _context;
        private readonly IConfiguration _configuration;
        public MstUserController(HrmanagementContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            #endregion
        }
        // 🔑 Generate Token with Role & Expiry from appsettings.json
        private string GenerateJwtToken(Login user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var expiryMinutes = Convert.ToDouble(jwtSettings["TokenExpiryMinutes"]);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(expiryMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ✅ LOGIN API
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login loginUser)
        {
            var user = await _context.MstUsers
                .FirstOrDefaultAsync(u => u.Email == loginUser.Email && u.Password == loginUser.Password );

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password" });

            var token = GenerateJwtToken(loginUser);

            return Ok(new
            {
                token,
                user = new { user.Email,user.Password,user.Role}
            });
        }








#region GetAllStudents 
[HttpGet]
        public async Task<ActionResult<List<MstUser>>> GetAllDetails()
        {
            var Users = await _context.MstUsers.ToListAsync();
            return Ok(Users);
        }
        #endregion

        #region DeleteById
        [HttpDelete("{id}")]
        public async Task<ActionResult<List<MstUser>>> DeleteByID(int id)
        {
            var User = await _context.MstUsers.FindAsync(id);

            if (User == null)
            {   
                return NotFound();
            }
            _context.MstUsers.Remove(User);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion

        #region GetById
        [HttpGet("{id}")]
        public async Task<ActionResult<MstUser>> GetByID(int id)
        {
            var User = await _context.MstUsers.FindAsync(id);
            if (User == null)
            {
                return NotFound();
            }

            return Ok(User);
        }


        #endregion

        #region Insert User
        [HttpPost]
        public async Task<ActionResult<List<MstUser>>> InsertUser([FromBody] MstUser user)
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
            _context.MstUsers.Add(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        #endregion

        #region Update user 
        [HttpPut("{id}")]
        public async Task<ActionResult<List<Employee>>> Updateuser(int id, [FromBody] MstUser user)
        {
            if (id != user.UserId)
            {
                return BadRequest("user ID mismatch");
            }
            var exisitingUser = await _context.MstUsers.FindAsync(id);
            if (exisitingUser == null)
            {
                return NotFound();
            }
            exisitingUser.Email = user.Email;
            exisitingUser.Password = user.Password;
            exisitingUser.Role = user.Role;
            exisitingUser.ModifiedDate = DateTime.Now;
            exisitingUser.UserId = user.UserId;

            _context.MstUsers.Update(exisitingUser);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion


    }
}
