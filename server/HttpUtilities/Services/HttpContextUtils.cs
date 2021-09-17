using Microsoft.AspNetCore.Http;
using System.Linq;

namespace HttpUtilities.Services
{
    public class HttpContextUtils: IHttpContextUtils
    {
        // Get user id from http context user claims
        public string GetUserId(HttpContext context)
        {
            var uid = context.User.Claims.FirstOrDefault(c => c.Type == "user_id");
            return uid != null ? uid.Value : "";
        }

        public string GetUserToken(HttpContext context)
        {
            var uid = context.User.Claims.FirstOrDefault(c => c.Type == "token");
            return uid != null ? uid.Value : "";
        }
    }
}
