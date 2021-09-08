using Identity.Interfaces.Identity;
using Microsoft.EntityFrameworkCore;
using Uragsha.Models.Scheduling;

namespace Entity
{
    public class MainDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<SessionRequest> SessionRequests { get; set; }

        public MainDbContext(DbContextOptions<MainDbContext> options)
        : base(options)
        {

        }
    }
}
