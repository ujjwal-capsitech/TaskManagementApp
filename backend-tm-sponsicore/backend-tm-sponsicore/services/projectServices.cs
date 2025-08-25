
using backend_tm_sponsicore.Models;
using MongoDB.Driver;

namespace backend_tm_sponsicore.Services
{
    public class ProjectService
    {
        private readonly IMongoCollection<Project> _projects;

        public ProjectService(IMongoDatabase database)
        {
            _projects = database.GetCollection<Project>("Projects");
        }

        public async Task<ApiResponse<Project>> CreateProjectAsync(Project project)
        {
            try
            {
                
                var existingProject = await _projects.Find(p => p.ProjectId == project.ProjectId).FirstOrDefaultAsync();
                if (existingProject != null)
                {
                    return ApiResponse<Project>.Error($"Project with ID {project.ProjectId} already exists");
                }

                await _projects.InsertOneAsync(project);
                return ApiResponse<Project>.Ok(project, "Project created successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<Project>.Error($"Failed to create project: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<Project>>> GetAllProjectsAsync()
        {
            try
            {
                var projects = await _projects.Find(_ => true).ToListAsync();
                return ApiResponse<List<Project>>.Ok(projects, "Projects retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<Project>>.Error($"Failed to retrieve projects: {ex.Message}");
            }
        }

        

    }
}