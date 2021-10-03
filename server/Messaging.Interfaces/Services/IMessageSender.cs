using Messaging.Interfaces.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Messaging.Interfaces.Services
{
    public interface IMessageSender
    {
        public Task<bool> SendMessageAsync(IMessage message);

        public Task<List<bool>> SendMessageAsync(List<IMessage> messages);
    }
}
