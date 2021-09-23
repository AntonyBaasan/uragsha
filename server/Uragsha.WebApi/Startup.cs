using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Uragsha.WebApi
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
            services.AddUragshaServices(Configuration);

            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
                options.SerializerSettings.DateFormatString = "yyyy'-'MM'-'dd'T'HH':'mm':'ssZ";
            });

            services.AddCors(options =>
            {
                options.AddPolicy(name: AllowUragshaWebOrigins,
                    builder =>
                    {
                        builder.WithOrigins(Configuration.GetSection("AllowedCors").Get<string[]>())
                            .AllowAnyHeader()
                            .AllowAnyMethod()
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
               });

            services.AddAuthorization(options =>
            {
                // Do not change Default policy. This is additional
                // use it later as [Authorize(Policy = "ServicePolicy")]
                options.AddPolicy("ServicePolicy", new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .AddAuthenticationSchemes("ServiceAuthentication")
                    .Build());
            });

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Uragsha.WebApi", Version = "v1" });
            });

            // TODO: temp memory distributed cache (until Redis is ready)
            // https://docs.microsoft.com/en-us/aspnet/core/performance/caching/distributed?view=aspnetcore-5.0#distributed-redis-cache
            services.AddDistributedMemoryCache();
            //services.AddStackExchangeRedisCache(options =>
            //{
            //    options.Configuration = Configuration.GetSection("Redis")["ConnectionString"];;
            //    options.InstanceName = "uragsha-staging";
            //});
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Uragsha.WebApi v1"));
            }

            app.UseCors(AllowUragshaWebOrigins);

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
