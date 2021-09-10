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
        private readonly IUserEntityService userEntityService;
        private readonly IMapper mapper;

        public UserService(IUserEntityService userEntityService, IMapper mapper)
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

        public Task<bool> UserExistAsync(string userId)
        {
            return userEntityService.ExistAsync(userId);
        }

    }
}
