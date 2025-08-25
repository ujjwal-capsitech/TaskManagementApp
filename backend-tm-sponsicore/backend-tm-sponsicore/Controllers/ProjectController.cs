
using backend_tm_sponsicore.Models;
using backend_tm_sponsicore.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend_tm_sponsicore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ProjectService _projectService;

        public ProjectsController(ProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(Project project)
        {
            var result = await _projectService.CreateProjectAsync(project);
            return result.Status ? Ok(result) : BadRequest(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            var result = await _projectService.GetAllProjectsAsync();
            return result.Status ? Ok(result) : BadRequest(result);
        }

        

    }
}