// Controllers/TasksController.cs
using backend_tm_sponsicore.Models;
using backend_tm_sponsicore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace backend_tm_sponsicore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService  taskService)
        {
            _taskService = taskService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(Tasks task)
        {
            
            var userId = "U-01"; 
            var userName = "Eleanor Pena"; 

            var result = await _taskService.CreateTaskAsync(task, userId, userName);
            return result.Status ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(string id)
        {
            var result = await _taskService.GetTaskByIdAsync(id);
            return result.Status ? Ok(result) : NotFound(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var result = await _taskService.GetAllTasksAsync();
            return result.Status ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(string id,Tasks task)
        {

            var userId = "U-01";
            var userName = "Eleanor Pena";

            var result = await _taskService.UpdateTaskAsync(id, task, userId, userName);
            return result.Status ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteTask(string id, string userId, string userName)
        {
            

            var result = await _taskService.SoftDeleteTaskAsync(id, userId, userName);
            return result.Status ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{taskId}/activities")]
        public async Task<IActionResult> GetTaskActivities(string taskId)
        {
            var result = await _taskService.GetTaskActivitiesAsync(taskId);
            return result.Status ? Ok(result) : BadRequest(result);
        }
    }
}