using Messaging.Interfaces.Models;
using System.Threading.Tasks;

namespace Messaging.Interfaces.Services
{
    public interface IMessageSender
    {
        public Task<bool> SendMessageAsync(IMessage message);
    }
}
