using AutoMapper;
using Entity.Models;
using Entity.Services;
using Identity.Interfaces.Models;
using Identity.Interfaces.Services;
using System.Threading.Tasks;

namespace Identity.Services
{
    public class UserService : IUserService
    {
        private readonly UserEntityService userEntityService;
        private readonly IMapper mapper;

        public UserService(UserEntityService userEntityService, IMapper mapper)
        {
            this.userEntityService = userEntityService;
            this.mapper = mapper;
        }

        public void AddUser(User user)
        {
            var userEntity = mapper.Map<User, UserEntity>(user);
            userEntityService.AddUser(userEntity);
        }

        public void DeleteUser(string userId)
        {
            userEntityService.DeleteUser(userId);
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            var userEntity = await this.userEntityService.GetUserByIdAsync(userId);
            if (userEntity == null) { return null; }
            var user = mapper.Map<UserEntity, User>(userEntity);
            return user;
        }

        public void UpdateUser(User user)
        {
            var userEntity = mapper.Map<User, UserEntity>(user);
            userEntityService.UpdateUser(userEntity);
        }

        public bool UserExist(string userId)
        {
            return userEntityService.Exist(userId);
        }

        Task<User> IUserService.GetUserByIdAsync(string userId)
        {
            throw new System.NotImplementedException();
        }
    }
}
