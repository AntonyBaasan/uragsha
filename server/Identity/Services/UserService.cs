using Identity.Entity;
using Identity.Interfaces.Identity;
using Identity.Interfaces.Services;

namespace Identity.Services
{
    public class UserService : IUserService
    {
        private readonly IUserEntityService userEntityService;

        public UserService(IUserEntityService userEntityService)
        {
            this.userEntityService = userEntityService;
        }
        public void AddUser(User user)
        {
           //this.userEntityService.
        }

        public void DeleteUser(string userId)
        {
            throw new System.NotImplementedException();
        }

        public User GetUserById(string userId)
        {
            throw new System.NotImplementedException();
        }

        public void UpdateUser(User user)
        {
            throw new System.NotImplementedException();
        }

        public bool UserExist(string userId)
        {
            throw new System.NotImplementedException();
        }
    }
}
