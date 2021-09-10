using Entity;
using Identity;
using Identity.Interfaces.Services;
using Identity.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Scheduler;
using Scheduler.Interfaces.Services;
using Scheduler.Services;

namespace Uragsha.Signalling
{
    public static class ConfigureUtils
    {
        public static void AddUragshaServices(this IServiceCollection services, IConfiguration configuration)
        {
            // setup database
            //services.AddDbContext<MainDbContext>(option => option.UseInMemoryDatabase("Debug"));
            services.AddDbContext<MainDbContext>(option => option.UseMySQL(configuration.GetConnectionString("DefaultConnection"), b => b.MigrationsAssembly("Uragsha.Signalling")));

            // load AutoMapper profiles
            services.AddAutoMapper(
                typeof(IdentityAutoMapperProfile),
                typeof(SchedulerAutoMapperProfile)
            );

            services.AddSingleton<ISessionRequestService, SessionRequestService>();
            services.AddSingleton<ISessionService, SessionService>();
            services.AddSingleton<IUserService, UserService>();
            services.AddSingleton<UserEntityService>();
        }
    }
}
