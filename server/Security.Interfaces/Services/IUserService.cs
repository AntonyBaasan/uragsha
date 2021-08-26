using Security.Interfaces.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Security.Interfaces.Services
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
