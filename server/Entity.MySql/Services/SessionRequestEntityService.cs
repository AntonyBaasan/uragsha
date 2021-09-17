using Entity.Models;
using Entity.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Entity.MySql.Services
{
    public class SessionRequestEntityService : ISessionRequestEntityService
    {
        private readonly CrudEntityService<SessionRequestEntity> _crudEntityService;
        private readonly IServiceScopeFactory _scopeFactory;

        public SessionRequestEntityService(IServiceScopeFactory scopeFactory)
        {
            _crudEntityService = new CrudEntityService<SessionRequestEntity>(scopeFactory);
            this._scopeFactory = scopeFactory;
        }

        public async Task<SessionRequestEntity> AddAsync(SessionRequestEntity entity)
        {
            return await _crudEntityService.AddAsync(entity);
        }

        public async Task DeleteAsync(string id, string userId)
        {
            using var scope = this._scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var entity = GetAsQueryable(dbContext).Where(s => s.Id.Equals(id) && s.UserId.Equals(userId)).FirstOrDefault();
            if (entity == null) { throw new KeyNotFoundException(); }
            dbContext.Remove(entity);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(string id)
        {
            var entity = new SessionRequestEntity() { Id = id };

            await _crudEntityService.DeleteAsync(entity);
        }

        public async Task<SessionRequestEntity> GetByIdAsync(string id)
        {
            return await _crudEntityService.GetByIdAsync(typeof(SessionRequestEntity), id);
        }

        public async Task<SessionRequestEntity> GetByIdAsync(string id, string userId)
        {
           using var scope = this._scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var entity = await GetAsQueryable(dbContext).Where(s => s.Id.Equals(id) && s.UserId.Equals(userId)).FirstOrDefaultAsync();
            if (entity == null) { throw new KeyNotFoundException(); }
            return entity;
        }

        public async Task UpdateAsync(SessionRequestEntity entity)
        {
            await _crudEntityService.UpdateAsync(entity);
        }

        public Task<bool> ExistAsync(string id)
        {
            return _crudEntityService.ExistAsync(typeof(SessionRequestEntity), id);
        }

        public Task<List<SessionRequestEntity>> FindByUserIdAsync(string userId)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var result = GetAsQueryable(dbContext).Where(s => s.UserId.Equals(userId));
            return result.ToListAsync();
        }

        private IQueryable<SessionRequestEntity> GetAsQueryable(MainDbContext context)
        {
            return context.SessionRequests.AsQueryable();
        }
    }
}
