using Identity.Interfaces.Identity;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Threading.Tasks;

namespace Entity
{
    public class UserEntityService
    {
        private readonly IServiceScopeFactory scopeFactory;

        public UserEntityService(IServiceScopeFactory scopeFactory)
        {
            this.scopeFactory = scopeFactory;
        }

        public void AddUser(User user)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            dbContext.Users.Add(user);
            dbContext.SaveChangesAsync();
        }

        public void DeleteUser(string userId)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var user = new User() { Id = userId };
            dbContext.Attach(user);
            dbContext.Remove(user);
            dbContext.SaveChangesAsync();
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var user = await dbContext.Users.FindAsync(userId);
            return user;
        }

        public void UpdateUser(User user)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            dbContext.Users.Update(user);
            dbContext.SaveChangesAsync();
        }

        public bool Exist(string userId)
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<MainDbContext>();
            var exist = dbContext.Users.Any(user => user.Id.Equals(userId, System.StringComparison.Ordinal));
            return exist;
        }
    }
}
