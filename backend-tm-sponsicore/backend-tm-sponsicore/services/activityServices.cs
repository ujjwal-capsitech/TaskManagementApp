
using backend_tm_sponsicore.Models;
using MongoDB.Driver;

namespace backend_tm_sponsicore.Services

{

    //public interface IActivityService
    //{
    //    Task<ApiResponse<Activity>> LogActivityAsync(Activity activity);
    //    Task<ApiResponse<List<Activity>>> GetActivitiesByTaskIdAsync(string taskId);
    //    Task<ApiResponse<List<Activity>>> GetActivitiesByProjectIdAsync(string projectId);
    //    Task<ApiResponse<Activity>> SoftDeleteActivityAsync(string id);
    //    Task<ApiResponse<Activity>> UpdateActivityAsync(string id, Activity activity);
    //}

    public class ActivityService 
    {
        private readonly IMongoCollection<Activity> _activities;

        public ActivityService(IMongoDatabase database)
        {
            _activities = database.GetCollection<Activity>("Activities");
        }

        public async Task<ApiResponse<Activity>> LogActivityAsync(Activity activity)
        {
            try
            {
                activity.CreatedAt = DateTime.UtcNow;
                await _activities.InsertOneAsync(activity);
                return ApiResponse<Activity>.Ok(activity, "Activity logged successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<Activity>.Error($"Failed to log activity: {ex.Message}");
            }
        }

        public async Task<ApiResponse<Activity>> UpdateActivityAsync(string id, Activity updatedActivity)
        {
            try
            {
                var existingActivity = await _activities.Find(a => a.Id == id && !a.IsDeleted).FirstOrDefaultAsync();
                if (existingActivity == null)
                    return ApiResponse<Activity>.Error("Activity not found");

                // Preserve the original creation date
                updatedActivity.CreatedAt = existingActivity.CreatedAt;
                updatedActivity.Id = existingActivity.Id; 

                await _activities.ReplaceOneAsync(a => a.Id == id, updatedActivity);

                return ApiResponse<Activity>.Ok(updatedActivity, "Activity updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<Activity>.Error($"Failed to update activity: {ex.Message}");
            }
        }



        public async Task<ApiResponse<List<Activity>>> GetActivitiesByTaskIdAsync(string taskId)
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

        public async Task<ApiResponse<List<Activity>>> GetActivitiesByProjectIdAsync(string projectId)
        {
            try
            {
                var activities = await _activities
                    .Find(a => a.ProjectId == projectId && !a.IsDeleted)
                    .SortByDescending(a => a.CreatedAt)
                    .ToListAsync();

                return ApiResponse<List<Activity>>.Ok(activities);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<Activity>>.Error($"Failed to retrieve activities: {ex.Message}");
            }
        }

        public async Task<ApiResponse<Activity>> SoftDeleteActivityAsync(string id)
        {
            try
            {
                var activity = await _activities.Find(a => a.Id == id && !a.IsDeleted).FirstOrDefaultAsync();
                if (activity == null)
                    return ApiResponse<Activity>.Error("Activity not found");

                var update = Builders<Activity>.Update
                    .Set(a => a.IsDeleted, true);

                await _activities.UpdateOneAsync(a => a.Id == id, update);

                return ApiResponse<Activity>.Ok(activity, "Activity deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<Activity>.Error($"Failed to delete activity: {ex.Message}");
            }
        }
    }
}