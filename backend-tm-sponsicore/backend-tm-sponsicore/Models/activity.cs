// Models/Activity.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend_tm_sponsicore.Models
{
    public class Activity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? TaskId { get; set; }
        public string? TaskTitle { get; set; }
        public string? ProjectId { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? AvatarUrl { get; set; }
        public string? ActivityTitle { get; set; }
        public string? ActivityDescription { get; set; }
        public string? StateFrom { get; set; }
        public string? StateTo { get; set; }
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }
}