using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace HttpUtilities.Services
{
    public class WebApiHttpContextService : IContextService
    {
        private readonly IServiceScopeFactory scopeFactory;

        public WebApiHttpContextService(IServiceScopeFactory scopeFactory)
        {
            this.scopeFactory = scopeFactory;
        }

        // Get user id from http context user claims
        public string GetUserId()
        {
            using var scope = scopeFactory.CreateScope();
            var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
            var uid = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "user_id");
            return uid != null ? uid.Value : "";
        }

        public string GetUserToken()
        {
            using var scope = scopeFactory.CreateScope();
            var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
            var uid = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "token");
            return uid != null ? uid.Value : "";
        }
    }
}
