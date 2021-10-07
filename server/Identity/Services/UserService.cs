using AutoMapper;
using Entity.Models.Identity;
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
            userEntityService.AddAsync(userEntity);
        }

        public void DeleteUser(string userId)
        {
            userEntityService.DeleteAsync(userId);
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            var userEntity = await userEntityService.GetByIdAsync(userId);
            if (userEntity == null) { return null; }
            var user = mapper.Map<UserEntity, User>(userEntity);
            return user;
        }

        public void UpdateUser(User user)
        {
            var userEntity = mapper.Map<User, UserEntity>(user);
            userEntityService.UpdateAsync(userEntity);
        }

        public Task<bool> UserExistAsync(string userId)
        {
            return userEntityService.ExistAsync(userId);
        }

    }
}
