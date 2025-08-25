using backend_tm_sponsicore.Models;
using backend_tm_sponsicore.services;
using Microsoft.AspNetCore.Mvc;

using System;
using System.Threading.Tasks;


namespace backend_tm_sponsicore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class userController : ControllerBase
    {
        private readonly userServices _userService;

        public userController(userServices userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] user newUser)
        {
            try
            {
                var createdUser = await _userService.RegisterUserAsync(newUser);
                return CreatedAtAction(nameof(Register), new { id = createdUser.Id }, createdUser);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        // create Task 
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                List<user> users = await _userService.GetUsersAsync();

                return Ok(ApiResponse<List<user>>.Ok(users, "Users fetched successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse.Error($"Failed to fetch users: {ex.Message}"));
            }
        }
    }
}


