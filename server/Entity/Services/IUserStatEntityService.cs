using System.Threading.Tasks;
using Entity.Models.Identity;

namespace Entity.Services
{
    public interface IUserStatEntityService
    {
        public Task<UserStatEntity> AddAsync(UserStatEntity stat);

        public Task<UserStatEntity> GetByUserIdAsync(string userId);

        public Task UpdateAsync(UserStatEntity user);

        public Task<bool> ExistAsync(string userId);
    }
}
