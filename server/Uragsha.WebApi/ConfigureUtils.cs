using Dashboard.Services;
using Entity;
using Entity.MySql.Services;
using Entity.Services;
using HttpUtilities.Services;
using Identity;
using Identity.Interfaces.Services;
using Identity.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Scheduler;
using Scheduler.Interfaces.Services;
using Scheduler.Services;

namespace Uragsha.WebApi
{
    public static class ConfigureUtils
    {
        public static void AddUragshaServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpContextAccessor();

            // setup database
            //services.AddDbContext<MainDbContext>(option => option.UseInMemoryDatabase("Debug"));
            services.AddDbContext<MainDbContext>(option => option.UseMySQL(configuration.GetConnectionString("DefaultConnection"), b => b.MigrationsAssembly("Uragsha.Signalling")));

            // load AutoMapper profiles
            services.AddAutoMapper(
                typeof(IdentityAutoMapperProfile),
                typeof(SchedulerAutoMapperProfile)
            );

            // Entity services
            services.AddSingleton<IUserEntityService, UserEntityService>();
            services.AddSingleton<ISessionRequestEntityService, SessionRequestEntityService>();
            services.AddSingleton<ISessionEntityService, SessionEntityService>();

            // Internal services
            services.AddSingleton<ISessionRequestService, SessionRequestService>();
            services.AddSingleton<ISessionService, SessionService>();
            services.AddSingleton<ISchedulerService, SchedulerService>();
            services.AddSingleton<IUserService, UserService>();
            services.AddSingleton<DashboardService>();

            services.AddSingleton<IContextService, WebApiHttpContextService>();

        }
    }
}
