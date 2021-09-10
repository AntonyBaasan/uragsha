using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace Entity.Services
{
    class CrudEntityService<T>
    {
        private readonly IServiceScopeFactory scopeFactory;

        public CrudEntityService(IServiceScopeFactory scopeFactory)
        {
            this.scopeFactory = scopeFactory;
        }

        public void Add(T entity)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            dbContext.Add(entity);
            dbContext.SaveChangesAsync();
        }

        public void Delete(T entity)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            dbContext.Attach(entity);
            dbContext.Remove(entity);
            dbContext.SaveChangesAsync();
        }

        // TODO: how can I not pass 'type' as param, where T is already exist.
        public async Task<T> GetUserByIdAsync(System.Type type, string id)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var user = await dbContext.FindAsync(type, id);
            return (T)user;
        }

        public void Update(T entity)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            dbContext.Update(entity);
            dbContext.SaveChangesAsync();
        }

        public async Task<bool> ExistAsync(System.Type type, object id)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var entity = await dbContext.FindAsync(type, id);
            return entity != null;
        }
    }
}
