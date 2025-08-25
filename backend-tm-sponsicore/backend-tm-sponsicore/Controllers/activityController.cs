using backend_tm_sponsicore.Services;
using backend_tm_sponsicore.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend_tm_sponsicore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class activityController : ControllerBase
    {
        private readonly ActivityService _activityService;

        public activityController(ActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpGet("task/{taskId}")]
        public async Task<IActionResult> GetActivitiesByTaskId(string taskId)
        {
            var result = await _activityService.GetActivitiesByTaskIdAsync(taskId);
            return result.Status ? Ok(result) : BadRequest(result);
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetActivitiesByProjectId(string projectId)
        {
            var result = await _activityService.GetActivitiesByProjectIdAsync(projectId);
            return result.Status ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteActivity(string id)
        {
            var result = await _activityService.SoftDeleteActivityAsync(id);
            return result.Status ? Ok(result) : BadRequest(result);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(string id, [FromBody] Activity activity)
        {
            var result = await _activityService.UpdateActivityAsync(id, activity);
            return result.Status ? Ok(result) : BadRequest(result);
        }
    }
}