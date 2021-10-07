using Entity.Models.Identity;
using Entity.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace Entity.MySql.Services
{
    public class UserEntityService : IUserEntityService
    {
        private readonly CrudEntityService<UserEntity> _crudEntityService;

        public UserEntityService(IServiceScopeFactory scopeFactory)
        {
            _crudEntityService = new CrudEntityService<UserEntity>(scopeFactory);
        }

        public async Task<UserEntity> AddAsync(UserEntity user)
        {
            return await _crudEntityService.AddAsync(user);
        }

        public async Task DeleteAsync(string userId)
        {
            var user = new UserEntity() { Id = userId };
            await _crudEntityService.DeleteAsync(user);
        }

        public async Task<UserEntity> GetByIdAsync(string userId)
        {
            return await _crudEntityService.GetByIdAsync(typeof(UserEntity), userId);
        }

        public async Task UpdateAsync(UserEntity user)
        {
            await _crudEntityService.UpdateAsync(user);
        }

        public Task<bool> ExistAsync(string userId)
        {
            return _crudEntityService.ExistAsync(typeof(UserEntity), userId);
        }

    }
}
