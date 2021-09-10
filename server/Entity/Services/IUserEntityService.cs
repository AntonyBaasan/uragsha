using System.Threading.Tasks;
using Entity.Models;

namespace Entity.Services
{
    public interface IUserEntityService
    {
        public void AddUser(UserEntity user);

        public void DeleteUser(string userId);

        public Task<UserEntity> GetUserByIdAsync(string userId);

        public void UpdateUser(UserEntity user);

        public Task<bool> ExistAsync(string userId);
    }
}
