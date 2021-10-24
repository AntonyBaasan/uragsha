using System.Threading.Tasks;
using AutoMapper;
using Entity.Models.Identity;
using Entity.Services;
using Identity.Interfaces.Models;
using Identity.Interfaces.Services;

namespace Identity.Services
{
    public class UserService : IUserService
    {
        private readonly IUserEntityService _userEntityService;
        private readonly IMapper _mapper;

        public UserService(IUserEntityService userEntityService, IMapper mapper)
        {
            _userEntityService = userEntityService;
            _mapper = mapper;
        }

        public void AddUser(User user)
        {
            var userEntity = _mapper.Map<User, UserEntity>(user);
            _userEntityService.AddAsync(userEntity);
        }

        public void DeleteUser(string userId)
        {
            _userEntityService.DeleteAsync(userId);
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            var userEntity = await _userEntityService.GetByIdAsync(userId);
            if (userEntity == null) { return null; }
            var user = _mapper.Map<UserEntity, User>(userEntity);
            return user;
        }

        public void UpdateUser(User user)
        {
            var userEntity = _mapper.Map<User, UserEntity>(user);
            _userEntityService.UpdateAsync(userEntity);
        }

        public Task<bool> UserExistAsync(string userId)
        {
            return _userEntityService.ExistAsync(userId);
        }

    }
}
