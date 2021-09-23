using Messaging.Interfaces.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Scheduler.Interfaces.Models;
using System.Threading.Tasks;
using Uragsha.Signalling.Hubs;

namespace Uragsha.WebApi.Controllers
{
    [ApiController]
    [Authorize(Policy = "ServicePolicy")]
    [Route("api/[controller]")]
    public class MessageListenerController : ControllerBase
    {
        private readonly ILogger<MessageListenerController> _logger;
        private readonly IHubContext<MainHub> hubcontext;

        public MessageListenerController(ILogger<MessageListenerController> logger, IHubContext<MainHub> hubcontext)
        {
            _logger = logger;
            this.hubcontext = hubcontext;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] HubMessage message)
        {
            _logger.LogDebug("Request Accepted:");
            _logger.LogDebug(message.ToString());

            if (message.GetMessageType() == MessageType.HubMessage)
            {
                var hubMessage = (HubMessage)message;
                var sessionRequest = JsonConvert.DeserializeObject<SessionRequest>(hubMessage.Content.Params.ToString());
                var userConnections = GlobalInfo.UserConnections[hubMessage.Content.ToUserId];
                await hubcontext.Clients.Clients(userConnections).SendAsync(hubMessage.Content.Method, sessionRequest);
            }

            return Ok();
        }
    }
}
