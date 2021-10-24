using Dashboard.Services;
using Email.Interfaces.Services;
using Email.SendGrid.Services;
using Entity;
using Entity.MySql.Services;
using Entity.Services;
using HttpUtilities.Services;
using Identity;
using Identity.Interfaces.Services;
using Identity.Services;
using Messaging.Http.Services;
using Messaging.Interfaces.Services;
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
            services.AddSingleton<IUserStatEntityService, UserStatEntityService>();
            services.AddSingleton<ISessionRequestEntityService, SessionRequestEntityService>();
            services.AddSingleton<ISessionRequestCommentEntityService, SessionRequestCommentEntityService>();
            services.AddSingleton<ISessionEntityService, SessionEntityService>();

            // Internal services
            services.AddSingleton<ISessionRequestService, SessionRequestService>();
            services.AddSingleton<ISessionRequestCommentService, SessionRequestCommentService>();
            services.AddSingleton<ISessionService, SessionService>();
            // NOTE: we need all matcher services for this webapi
            services.AddSingleton<IMatcherService, MatcherService>();
            services.AddSingleton<IUserService, UserService>();
            services.AddSingleton<DashboardService>();
            services.AddSingleton<IEmailService>(new SendGridEmailService(configuration.GetSection("ApiKey:SendGridKey").Value));

            services.AddSingleton<IContextService, WebApiHttpContextService>();

            services.AddHttpClient();
            services.AddSingleton<IMessageSender, HttpMessageSender>();
        }
    }
}
