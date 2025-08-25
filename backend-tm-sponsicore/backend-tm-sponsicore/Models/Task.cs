// Models/Task.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend_tm_sponsicore.Models
{
    public class Tasks
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? TaskId { get; set; }
        public string? TaskTitle { get; set; }
        public string? Description { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc, DateOnly = true)]
        public DateTime? DueDate { get; set; }
        public List<Comment>? Comments { get; set; }
        public Project? Project { get; set; }
        public Reporter? Reporter { get; set; }
        public List<Assignee>? Assignees { get; set; }
        public TaskStatus? Status { get; set; }
        public Priority Priority { get; set; }
        public string? Attachment { get; set; }
        public bool IsDeleted { get; set; } = false;
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Reporter
    {
        public string? ReporterId { get; set; }
        public string? Name { get; set; }
    }

    public class Assignee
    {
        public string AssigneeId { get; set; }
        public string Name { get; set; }
    }

    public enum TaskStatus
    {
        InProgress,
        Todo,
        NTD,
        Done,
    }

    public enum Priority
    {
        High,
        Normal,
        Low,
    }

    public class Comment
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Project
    {
        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }
    }
}