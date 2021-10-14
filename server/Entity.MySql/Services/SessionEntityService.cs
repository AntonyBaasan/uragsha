using Entity.Models;
using Entity.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Threading.Tasks;

namespace Entity.MySql.Services
{
    public class SessionEntityService : ISessionEntityService
    {
        private readonly CrudEntityService<SessionEntity> _crudEntityService;
        private readonly IServiceScopeFactory _scopeFactory;

        public SessionEntityService(IServiceScopeFactory scopeFactory)
        {
            _crudEntityService = new CrudEntityService<SessionEntity>(scopeFactory);
            this._scopeFactory = scopeFactory;
        }

        public async Task<SessionEntity> AddAsync(SessionEntity entity)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            foreach (var sessionRequest in entity.SessionRequests)
            {
                dbContext.Attach(sessionRequest);
            }
            dbContext.Sessions.Add(entity);
            var result = await dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(string id)
        {
            var entity = new SessionEntity() { Id = id };

            await _crudEntityService.DeleteAsync(entity);
        }

        public async Task<SessionEntity> GetByIdAsync(string id)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var user = await dbContext.Sessions
                .Where(s=>s.Id.Equals(id))
                .Include(s=>s.SessionRequests)
                .FirstOrDefaultAsync();
            return user;
        }

        public async Task UpdateAsync(SessionEntity entity)
        {
            await _crudEntityService.UpdateAsync(entity);
        }

        public Task<bool> ExistAsync(string id)
        {
            return _crudEntityService.ExistAsync(typeof(SessionEntity), id);
        }

        public Task<SessionEntity> GetBySessionRequestIdAsync(string sessionRequestId)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var result = GetAsQueryable(dbContext)
                .Where(s => s.SessionRequests.Any(sr => sr.Id.Equals(sessionRequestId)))
                .Include(s=>s.SessionRequests)
                .FirstOrDefaultAsync();
            return result;
        }

        private IQueryable<SessionEntity> GetAsQueryable(MainDbContext context)
        {
            return context.Sessions.AsQueryable();
        }
    }
}
