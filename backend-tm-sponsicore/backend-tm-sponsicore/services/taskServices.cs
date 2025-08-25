// Services/ITaskService.cs
using backend_tm_sponsicore.Models;
using backend_tm_sponsicore.services;
using MongoDB.Driver;

namespace backend_tm_sponsicore.Services
{
   
    public class TaskService 
    {
        private readonly IMongoCollection<Tasks> _tasks;
        private readonly IMongoCollection<Activity> _activities;
        private readonly ActivityService _activityService;

        public TaskService(IMongoDatabase database, ActivityService activityService)
        {
            _tasks = database.GetCollection<Tasks>("Tasks");
            _activities = database.GetCollection<Activity>("Activities");
            _activityService = activityService;
        }

        public async Task<ApiResponse<Tasks>> CreateTaskAsync(Tasks task, string userId, string userName)
        {
            try
            {
                if (string.IsNullOrEmpty(task.TaskId))
                {
                    long count = await _tasks.CountDocumentsAsync(_ => true);
                    long next = count + 1;
                    task.TaskId= $"SC-{next.ToString().PadLeft(2, '0')}";
                }

                task.CreatedAt = DateTime.UtcNow;
                task.UpdatedAt = DateTime.UtcNow;

                await _tasks.InsertOneAsync(task);

                // Log activity
                var activity = new Activity
                {
                    Id = task.Id,
                    TaskId = task.TaskId,
                    TaskTitle = task.TaskTitle,
                    ProjectId = task.Project.ProjectId,
                    UserId = userId,
                    UserName = userName,
                    ActivityTitle = "created new Task",
                    ActivityDescription = $"Created task {task.TaskTitle}",
                    CreatedAt = DateTime.UtcNow
                };

                await _activityService.LogActivityAsync(activity);

                return ApiResponse<Tasks>.Ok(task, "Task created successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<Tasks>.Error($"Failed to create task: {ex.Message}");
            }
        }

        public async Task<ApiResponse<Tasks>> GetTaskByIdAsync(string id)
        {
            try
            {
                var task = await _tasks.Find(t => t.Id == id && !t.IsDeleted).FirstOrDefaultAsync();
                if (task == null)
                    return ApiResponse<Tasks>.Error("Task not found");

                return ApiResponse<Tasks>.Ok(task);
            }
            catch (Exception ex)
            {
                return ApiResponse<Tasks>.Error($"Failed to retrieve task: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<Tasks>>> GetAllTasksAsync()
        {
            try
            {
                var tasks = await _tasks.Find(t => !t.IsDeleted).ToListAsync();
                return ApiResponse<List<Tasks>>.Ok(tasks);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<Tasks>>.Error($"Failed to retrieve tasks: {ex.Message}");
            }
        }

        public async Task<ApiResponse<Tasks>> UpdateTaskAsync(string id, Tasks updatedTask, string userId, string userName)
        {
            try
            {
                var existingTask = await _tasks.Find(t => t.TaskId == id && !t.IsDeleted).FirstOrDefaultAsync();
                if (existingTask == null)
                    return ApiResponse<Tasks>.Error("Task not found");

                // Track changes for activity log
                var changes = new List<string>();
                var changesTitle = new List<string>();

                if (existingTask.TaskTitle != updatedTask.TaskTitle)
                    changes.Add($"{existingTask.TaskTitle} > {updatedTask.TaskTitle}");
                    changesTitle.Add("renamed the task name");
                    
                if (existingTask.Description != updatedTask.Description)
                    changes.Add($"{existingTask.Description}>{updatedTask.Description}");
                    changesTitle.Add("changed description");

                if (existingTask.Status != updatedTask.Status)
                    changes.Add($"Status: {existingTask.Status} > {updatedTask.Status}");
                changesTitle.Add($"changes status on {updatedTask.TaskId}");
                if (existingTask.Priority != updatedTask.Priority)
                    changes.Add($"Priority: {existingTask.Priority} > {updatedTask.Priority}");
                    changesTitle.Add($"changes Priority on {updatedTask.TaskId}");
                // Update the task
                updatedTask.Id = existingTask.Id;
                updatedTask.UpdatedAt = DateTime.UtcNow;

                await _tasks.ReplaceOneAsync(t => t.Id == id, updatedTask);

                // Log activity if there were changes
                if (changes.Any())
                {
                    var activity = new Activity
                    {
                        
                        TaskId = updatedTask.TaskId,
                        TaskTitle = updatedTask.TaskTitle,
                        ProjectId = updatedTask.Project.ProjectId,
                        UserId = userId,
                        UserName = userName,
                        ActivityTitle = string.Join(", ", changesTitle),
                        ActivityDescription = string.Join(", ", changes),
                        StateFrom = $"{existingTask.Status}|{existingTask.Priority}",
                        StateTo = $"{updatedTask.Status}|{updatedTask.Priority}",
                        CreatedAt = DateTime.UtcNow
                    };

                    await _activityService.LogActivityAsync(activity);
                }

                return ApiResponse<Tasks>.Ok(updatedTask, "Task updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<Tasks>.Error($"Failed to update task: {ex.Message}");
            }
        }

        public async Task<ApiResponse<Tasks>> SoftDeleteTaskAsync(string id, string userId, string userName)
        {
            try
            {
                var task = await _tasks.Find(t => t.TaskId == id && !t.IsDeleted).FirstOrDefaultAsync();
                if (task == null)
                    return ApiResponse<Tasks>.Error("Task not found");

                var update = Builders<Tasks>.Update
                    .Set(t => t.IsDeleted, true)
                    .Set(t => t.UpdatedAt, DateTime.UtcNow);

                await _tasks.UpdateOneAsync(t => t.Id == id, update);

                // Log activity
                var activity = new Activity
                {
                    TaskId = task.TaskId,
                    TaskTitle = task.TaskTitle,
                    ProjectId = task.Project.ProjectId,
                    UserId = userId,
                    UserName = userName,
                    ActivityTitle = "deleted Task",
                    ActivityDescription = $"Deleted task {task.TaskTitle}",
                    CreatedAt = DateTime.UtcNow
                };

                await _activityService.LogActivityAsync(activity);

                return ApiResponse<Tasks>.Ok(task, "Task deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<Tasks>.Error($"Failed to delete task: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<Activity>>> GetTaskActivitiesAsync(string taskId)
        {
            try
            {
                var activities = await _activities
                    .Find(a => a.TaskId == taskId && !a.IsDeleted)
                    .SortByDescending(a => a.CreatedAt)
                    .ToListAsync();

                return ApiResponse<List<Activity>>.Ok(activities);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<Activity>>.Error($"Failed to retrieve activities: {ex.Message}");
            }
        }
    }
}
