using Identity.Interfaces.Models;
using System.Threading.Tasks;

namespace Identity.Interfaces.Services
{
    public interface IUserStatService
    {
        public Task<UserStat> GetByUserIdAsync(string userId);
        public void Add(UserStat user);
        public void Update(UserStat user);
        public Task<bool> ExistAsync(string userId);
    }
}
