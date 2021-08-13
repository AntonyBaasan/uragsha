using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Uragsha.Scheduler.Interfaces;
using Uragsha.Scheduler.Memory;
using Uragsha.Signalling.Hubs;

namespace Uragsha.Signalling
{
    public class Startup
    {
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

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapHub<MainHub>("/mainHub");
            });
        }
    }
}
