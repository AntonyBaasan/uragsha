using System.Threading.Tasks;

namespace HttpUtilities.Auth
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
            this.token = "Basic " + token;
        }

        public Task<bool> Authenticate(string token)
        {
            return Task.FromResult(this.token.Equals(token));
        }
    }
}
