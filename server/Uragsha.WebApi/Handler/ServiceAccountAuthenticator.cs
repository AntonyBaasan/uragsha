using System.Threading.Tasks;

namespace Uragsha.WebApi.Handler
{
    public interface IServiceAccountAuthenticator
    {
        public Task<bool> Authenticate(string token);
    }

    public class ServiceAccountAuthenticator : IServiceAccountAuthenticator
    {
        private readonly string token;

        public ServiceAccountAuthenticator(string token)
        {
            this.token = token;
        }

        public Task<bool> Authenticate(string token)
        {
            return Task.FromResult(this.token.Equals(token));
        }
    }
}
