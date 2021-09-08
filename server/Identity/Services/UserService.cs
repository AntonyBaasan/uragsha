using Entity;
using Identity.Interfaces.Identity;
using Identity.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Services
{
    public class UserService : IUserService
    {
        private readonly UserEntityService userEntityService;

        public UserService(UserEntityService userEntityService)
        {
            this.userEntityService = userEntityService;
        }

        public void AddUser(User user)
        {
            this.userEntityService.AddUser(user);
        }

        public void DeleteUser(string userId)
        {
            this.userEntityService.DeleteUser(userId);
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await this.userEntityService.GetUserByIdAsync(userId);
        }

        public void UpdateUser(User user)
        {
            this.userEntityService.UpdateUser(user);
        }

        public bool UserExist(string userId)
        {
            return this.userEntityService.Exist(userId);
        }
    }
}
