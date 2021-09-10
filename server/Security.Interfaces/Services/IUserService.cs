using Identity.Interfaces.Models;
using System.Threading.Tasks;

namespace Identity.Interfaces.Services
{
    public interface IUserService
    {
        public Task<User> GetUserByIdAsync(string userId);
        public void AddUser(User user);
        public void UpdateUser(User user);
        public void DeleteUser(string userId);
        public Task<bool> UserExistAsync(string userId);
    }
}
