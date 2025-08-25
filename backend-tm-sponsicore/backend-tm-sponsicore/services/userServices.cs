using backend_tm_sponsicore.Controllers;
using backend_tm_sponsicore.Models;
using MongoDB.Driver;

using System.Threading.Tasks;
using ZstdSharp.Unsafe;


namespace backend_tm_sponsicore.services
{
    public class userServices
    {
        private readonly IMongoCollection<user> _users;

        public userServices(IMongoDatabase database)
        {
            _users = database.GetCollection<user>("users");
        }

        public async Task<user> RegisterUserAsync(user newUser)
        { 
            if (string.IsNullOrEmpty(newUser.UserId))
            {
                long count = await _users.CountDocumentsAsync(_ => true);
                long next = count + 1;
                newUser.UserId = $"U-{next.ToString().PadLeft(2, '0')}";
            }

            await _users.InsertOneAsync(newUser);

            return newUser;
        }
        public async Task<List<user>> GetUsersAsync() =>
            await _users.Find(_ => true).ToListAsync();
    }
}


