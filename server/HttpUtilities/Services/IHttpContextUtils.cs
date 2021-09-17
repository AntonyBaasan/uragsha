using Microsoft.AspNetCore.Http;

namespace HttpUtilities.Services
{
    public interface IHttpContextUtils
    {
        public string GetUserId(HttpContext context);

        public string GetUserToken(HttpContext context);
    }
}
