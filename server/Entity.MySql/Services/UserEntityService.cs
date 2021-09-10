using Entity.Models;
using Entity.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace Entity.MySql.Services
{
    public class UserEntityService: IUserEntityService
    {
        private readonly CrudEntityService<UserEntity> userCrudEntityService;

        public UserEntityService(IServiceScopeFactory scopeFactory)
        {
            this.userCrudEntityService = new CrudEntityService<UserEntity>(scopeFactory);
        }

        public void AddUser(UserEntity user)
        {
            userCrudEntityService.Add(user);
        }

        public void DeleteUser(string userId)
        {
            var user = new UserEntity() { Id = userId };

            userCrudEntityService.Delete(user);
        }

        public async Task<UserEntity> GetUserByIdAsync(string userId)
        {
            return await userCrudEntityService.GetUserByIdAsync(typeof(UserEntity), userId);
        }

        public void UpdateUser(UserEntity user)
        {
            this.userCrudEntityService.Update(user);
        }

        public Task<bool> ExistAsync(string userId)
        {
            return userCrudEntityService.ExistAsync(typeof(UserEntity), userId);
        }
    }
}
