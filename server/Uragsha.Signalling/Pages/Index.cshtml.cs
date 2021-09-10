using System.Linq;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;
using System.Collections.Generic;
using Uragsha.Signalling.Hubs;

namespace Uragsha.Signalling.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IHubContext<MainHub> _hubContext;
        public List<string> connections = new List<string>();
        public Dictionary<string, SessionDetail> rooms = new ();

        public IndexModel(ILogger<IndexModel> logger, IHubContext<MainHub> hubContext)
        {
            _logger = logger;
            _hubContext = hubContext;
        }

        public void OnGet()
        {
            connections = GlobalInfo.ConnectedIds.ToList();
            rooms = GlobalInfo.ActiveSession;
        }
    }
}
