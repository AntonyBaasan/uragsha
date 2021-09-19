using Email.Interfaces.Models;
using System.Threading.Tasks;

namespace Email.Interfaces.Services
{
    public interface IEmailService
    {
        public Task<bool> SendEmailAsync(EmailInfo info);
    }
}
