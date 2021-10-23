using System.Collections.Generic;
using System.Threading.Tasks;
using Messaging.Interfaces.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Scheduler.Interfaces.Models;
using Uragsha.Signalling.Hubs;

namespace Uragsha.Signalling.Controllers
{
    [ApiController]
    [Authorize(Policy = "ServicePolicy")]
    [Route("api/[controller]")]
    public class MessageListenerController : ControllerBase
    {
        private readonly ILogger<MessageListenerController> _logger;
        private readonly IHubContext<MainHub> _hubcontext;

        public MessageListenerController(ILogger<MessageListenerController> logger, IHubContext<MainHub> hubcontext)
        {
            _logger = logger;
            _hubcontext = hubcontext;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] List<HubMessage> messages)
        {
            _logger.LogDebug("Post request accepted: " + messages.Count);

            await HandleMessages(messages);

            return Ok();
        }

        private async Task HandleMessages(List<HubMessage> messages)
        {
            foreach (var message in messages)
            {
                if (message.GetMessageType() == MessageType.HubMessage)
                {
                    var hubMessage = (HubMessage)message;
                    var sessionRequest = JsonConvert.DeserializeObject<SessionRequest>(hubMessage.Content.Params.ToString());
                    List<string> userConnections = new();
                    foreach (var userId in hubMessage.Content.ToUserId)
                    {
                        _logger.LogDebug($"Method {hubMessage.Content.Method} was called for user {userId}");
                        await _hubcontext.Clients.User(userId).SendAsync(hubMessage.Content.Method, sessionRequest);
                    }
                }
            }
        }
    }
}
