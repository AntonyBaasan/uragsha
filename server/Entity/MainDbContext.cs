using Entity.Models;
using Entity.Models.Identity;
using Entity.Services;
using Microsoft.EntityFrameworkCore;

namespace Entity
{
    public class MainDbContext : DbContext
    {
        public DbSet<UserEntity> Users { get; set; }
        public DbSet<UserRoleEntity> UserRoles { get; set; }
        public DbSet<SessionEntity> Sessions { get; set; }
        public DbSet<SessionRequestEntity> SessionRequests { get; set; }
        public DbSet<SessionRequestCommentEntity> SessionRequestComments { get; set; }

        public MainDbContext(DbContextOptions<MainDbContext> options)
        : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SessionRequestCommentEntity>()
                .HasOne(c => c.GivenSessionRequest)
                .WithOne(s => s.GivenSessionRequestComment)
                //.HasForeignKey<SessionRequestEntity>(s=>s.GivenSessionRequestCommentId)
                .HasForeignKey<SessionRequestCommentEntity>(c=>c.GivenSessionRequestId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<SessionRequestCommentEntity>()
                .HasOne(c => c.ReceivedSessionRequest)
                .WithOne(s => s.ReceivedSessionRequestComment)
                //.HasForeignKey<SessionRequestEntity>(s=>s.ReceivedSessionRequestCommentId)
                .HasForeignKey<SessionRequestCommentEntity>(c=>c.ReceivedSessionRequestId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
