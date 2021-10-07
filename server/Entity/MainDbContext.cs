using Entity.Models;
using Entity.Models.Identity;
using Microsoft.EntityFrameworkCore;

namespace Entity
{
    public class MainDbContext : DbContext
    {
        public DbSet<UserEntity> Users { get; set; }
        public DbSet<UserRoleEntity> UserRoles { get; set; }
        public DbSet<SessionEntity> Sessions { get; set; }
        public DbSet<SessionRequestEntity> SessionRequests { get; set; }

        public MainDbContext(DbContextOptions<MainDbContext> options)
        : base(options)
        {

        }
    }
}
