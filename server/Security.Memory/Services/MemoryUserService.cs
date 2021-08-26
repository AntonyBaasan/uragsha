using System;
using System.Linq;
using Security.Interfaces.Identity;
using Security.Interfaces.Services;
using System.Collections.Generic;

namespace Security.Memory
{
    public class MemoryUserService : IUserService
    {
        public List<User> _users = new();

        public void AddUser(User user)
        {
            if (_users.Exists(u => u.Uid == user.Uid))
            {
                throw new ArgumentException("User with this uid already exists!");
            }
            _users.Add(user);
        }

        public void DeleteUser(string userId)
        {
            _users.RemoveAll(u => u.Uid == userId);
        }

        public User GetUserById(string userId)
        {
            return _users.FirstOrDefault(u => u.Uid == userId);
        }

        public void UpdateUser(User user)
        {
            _users.RemoveAll(u => u.Uid == user.Uid);
            _users.Add(user);
        }

        public bool UserExist(string userId)
        {
            return _users.Exists(u => u.Uid == userId);
        }
    }
}
