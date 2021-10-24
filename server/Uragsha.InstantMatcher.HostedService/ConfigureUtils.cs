﻿using Email.Interfaces.Services;
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

namespace Uragsha.InstantMatcher.HostedService
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

            // Entity services
            services.AddSingleton<IUserEntityService, UserEntityService>();
            services.AddSingleton<ISessionRequestEntityService, SessionRequestEntityService>();
            services.AddSingleton<ISessionRequestCommentEntityService, SessionRequestCommentEntityService>();
            services.AddSingleton<ISessionEntityService, SessionEntityService>();

            // Internal services
            services.AddSingleton<ISessionRequestService, SessionRequestService>();
            services.AddSingleton<ISessionService, SessionService>();
            services.AddSingleton<IMatcherService, MatcherInstantService>();
            services.AddSingleton<IUserService, UserService>();
            services.AddSingleton<IEmailService>(new SendGridEmailService(configuration.GetSection("ApiKey:SendGridKey").Value));

            services.AddSingleton<IContextService, WebApiHttpContextService>();

            services.AddHttpClient();
            services.AddSingleton<IMessageSender, HttpMessageSender>();

        }
    }
}
