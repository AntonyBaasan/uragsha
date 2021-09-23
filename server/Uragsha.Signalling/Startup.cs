using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Uragsha.Signalling.Hubs;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.AspNetCore.Authentication;
using HttpUtilities.Auth;
using Microsoft.AspNetCore.Authorization;

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
            services.AddUragshaServices(Configuration);

            services.AddSingleton<IServiceAccountAuthenticator>(new ServiceAccountAuthenticator(Configuration.GetSection("ApiKey:ServiceAccountKey").Value));

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
            .AddScheme<AuthenticationSchemeOptions, ServiceAuthenticationHandler>("ServiceAuthentication", options => { })
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

            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
                options.SerializerSettings.DateFormatString = "yyyy'-'MM'-'dd'T'HH':'mm':'ssZ";
            });
            services.AddRazorPages();
            services.AddSignalR();

            services.AddAuthorization(options =>
           {
               // Do not change Default policy. This is additional policy!
               // use it in the controller as [Authorize(Policy = "ServicePolicy")]
               options.AddPolicy("ServicePolicy", new AuthorizationPolicyBuilder()
                  .RequireAuthenticatedUser()
                  .AddAuthenticationSchemes("ServiceAuthentication")
                  .Build());
           });

            // temp code from webapi
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Uragsha.WebApi", Version = "v1" });
            });


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app,
            IWebHostEnvironment env,
            IHostApplicationLifetime lifetime,
            IDistributedCache cache)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                // temp code from webapi
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("", "Uragsha.WebApi v1"));
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            app.UseStaticFiles();

            app.UseCors(AllowUragshaWebOrigins);

            app.UseAuthentication();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapRazorPages();
                endpoints.MapHub<MainHub>(HubName);
            });
        }
    }
}
