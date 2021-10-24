using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace Entity.MySql.Services
{
    internal class CrudEntityService<T>
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public CrudEntityService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public async Task<T> AddAsync(T entity)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            dbContext.Add(entity);
            var result = await dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(T entity)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            dbContext.Attach(entity);
            dbContext.Remove(entity);
            await dbContext.SaveChangesAsync();
        }

        // TODO: how can I not pass 'type' as param, where T is already exist.
        public async Task<T> GetByIdAsync(Type type, string id)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var user = await dbContext.FindAsync(type, id);
            return (T)user;
        }

        public async Task UpdateAsync(T entity)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            dbContext.Attach(entity);
            dbContext.Update(entity);
            await dbContext.SaveChangesAsync();
        }

        public async Task<bool> ExistAsync(Type type, object id)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var entity = await dbContext.FindAsync(type, id);
            return entity != null;
        }
    }
}
