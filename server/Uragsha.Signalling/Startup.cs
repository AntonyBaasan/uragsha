using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Security.Interfaces.Services;
using Security.Memory;
using Uragsha.Scheduler.Interfaces;
using Uragsha.Scheduler.Memory;
using Uragsha.Signalling.Hubs;

namespace Uragsha.Signalling
{
    public class Startup
    {
        readonly string HubName = "/mainHub";
        readonly string AllowUragshaWebOrigins = "_allowUragshaWebOrigins";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<ISessionRequestService, MemorySessionRequestService>();
            services.AddSingleton<ISessionService, MemorySessionService>();
            services.AddSingleton<IUserService, MemoryUserService>();

            services.AddCors(options =>
            {
                options.AddPolicy(name: AllowUragshaWebOrigins,
                    builder =>
                    {
                        builder.WithOrigins(Configuration.GetSection("AllowedCors").Get<string[]>())
                            .AllowAnyHeader()
                            .WithMethods("GET", "POST")
                            .AllowCredentials();
                    });
            });

            services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
               {
                   options.Authority = "https://securetoken.google.com/uragsha-webapp";
                   options.TokenValidationParameters = new TokenValidationParameters
                   {
                       ValidateIssuer = true,
                       ValidIssuer = "https://securetoken.google.com/uragsha-webapp",
                       ValidateAudience = true,
                       ValidAudience = "uragsha-webapp",
                       ValidateLifetime = true
                   };
                   options.Events = new JwtBearerEvents
                   {
                       OnMessageReceived = context =>
                       {
                           var accessToken = context.Request.Query["access_token"];

                           // If the request is for our hub...
                           var path = context.HttpContext.Request.Path;
                           if (!string.IsNullOrEmpty(accessToken) &&
                               (path.StartsWithSegments(HubName)))
                           {
                               // Read the token out of the query string
                               context.Token = accessToken;
                           }
                           return Task.CompletedTask;
                       }
                   };
               });

            services.AddRazorPages();
            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseCors(AllowUragshaWebOrigins);

            app.UseAuthentication();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapHub<MainHub>(HubName);
            });
        }
    }
}
