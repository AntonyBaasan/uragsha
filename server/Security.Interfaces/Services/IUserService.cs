using Identity.Interfaces.Identity;

namespace Identity.Interfaces.Services
{
    public interface IUserService
    {
        public User GetUserById(string userId);
        public void AddUser(User user);
        public void UpdateUser(User user);
        public void DeleteUser(string userId);
        public bool UserExist(string userId);
    }
}
