using Entity;
using Identity.Interfaces.Services;
using Identity.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Uragsha.Scheduler.Interfaces;
using Uragsha.Scheduler.Memory;

namespace Uragsha.Signalling
{
    public static class ConfigureUtils
    {
        public static void AddUragshaServices(this IServiceCollection services)
        {
            services.AddDbContext<MainDbContext>(option => option.UseInMemoryDatabase("Debug"));
            services.AddSingleton<ISessionRequestService, SessionRequestService>();
            services.AddSingleton<ISessionService, SessionService>();
            services.AddSingleton<IUserService, UserService>();
            services.AddSingleton<UserEntityService>();
            
        }
    }
}
