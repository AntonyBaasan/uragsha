using System.Threading.Tasks;
using AutoMapper;
using Entity.Models.Identity;
using Entity.Services;
using Identity.Interfaces.Models;
using Identity.Interfaces.Services;

namespace Identity.Services
{
    public class UserStatService : IUserStatService
    {
        private readonly IUserStatEntityService _userStatEntityService;
        private readonly IMapper _mapper;

        public UserStatService(IUserStatEntityService userStatEntityService, IMapper mapper)
        {
            _userStatEntityService = userStatEntityService;
            _mapper = mapper;
        }

        public void Add(UserStat stat)
        {
            var statEntity = _mapper.Map<UserStat, UserStatEntity>(stat);
            _userStatEntityService.AddAsync(statEntity);
        }

               public async Task<UserStat> GetByUserIdAsync(string userId)
        {
            var userEntity = await _userStatEntityService.GetByUserIdAsync(userId);
            if (userEntity == null) { return null; }
            var stat = _mapper.Map<UserStatEntity, UserStat>(userEntity);
            return stat;
        }

        public void Update(UserStat stat)
        {
            var userEntity = _mapper.Map<UserStat, UserStatEntity>(stat);
            _userStatEntityService.UpdateAsync(userEntity);
        }

        public Task<bool> ExistAsync(string userId)
        {
            return _userStatEntityService.ExistAsync(userId);
        }

    }
}
