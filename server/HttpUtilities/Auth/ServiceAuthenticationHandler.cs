using System;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;

namespace HttpUtilities.Auth
{
    public class ServiceAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IServiceAccountAuthenticator serviceAccountAuthenticator;

        public ServiceAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            IServiceAccountAuthenticator serviceAccountAuthenticator
            ) : base(options, logger, encoder, clock)
        {
            this.serviceAccountAuthenticator = serviceAccountAuthenticator;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // 1.
            // read data from Authorization header
            var authorizationKey = new StringValues();
            Request.Headers.TryGetValue("Authorization", out authorizationKey);

            // 2.
            // get information about user
            var isAuth = await serviceAccountAuthenticator.Authenticate(authorizationKey.ToString());
            if (!isAuth)
            {
                return AuthenticateResult.Fail("Service account key does not match");
            }

            var identity = CreateIdentity("service", Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }

        // 1. (continuation)
        // ... following part of ClaimsIdentity creation
        public static ClaimsIdentity CreateIdentity(string user, string authenticationScheme)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user)
            };

            var identity = new ClaimsIdentity(claims, authenticationScheme);

            identity.AddClaim(new Claim(ClaimTypes.Role, "service account"));
            return identity;
        }
    }
}
