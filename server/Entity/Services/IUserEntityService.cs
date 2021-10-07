using System.Threading.Tasks;
using Entity.Models;
using Entity.Models.Identity;

namespace Entity.Services
{
    public interface IUserEntityService
    {
        public Task<UserEntity> AddAsync(UserEntity user);

        public Task DeleteAsync(string userId);

        public Task<UserEntity> GetByIdAsync(string userId);

        public Task UpdateAsync(UserEntity user);

        public Task<bool> ExistAsync(string userId);
    }
}
