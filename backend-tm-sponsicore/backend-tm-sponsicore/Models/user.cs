using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend_tm_sponsicore.Models
{
    public class user
    {


        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        
        public string? UserId { get; set; } 

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        public string AvatarUrl { get; set; } = null!;
    }
}
