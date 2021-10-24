using System.Linq;
using Entity.Models.Identity;
using Entity.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Entity.MySql.Services
{
    public class UserStatEntityService : IUserStatEntityService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly CrudEntityService<UserStatEntity> _crudEntityService;

        public UserStatEntityService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
            _crudEntityService = new CrudEntityService<UserStatEntity>(scopeFactory);
        }

        public async Task<UserStatEntity> AddAsync(UserStatEntity user)
        {
            return await _crudEntityService.AddAsync(user);
        }

        public async Task<UserStatEntity> GetByUserIdAsync(string userId)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var stat = await dbContext.UserStats.FirstOrDefaultAsync(s => s.UserId.Equals(userId));
            return stat;
        }

        public async Task UpdateAsync(UserStatEntity stat)
        {
            await _crudEntityService.UpdateAsync(stat);
        }

        public async Task<bool> ExistAsync(string userId)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var exist = await dbContext.UserStats.AnyAsync(s => s.UserId.Equals(userId));
            return exist;
        }

    }
}
