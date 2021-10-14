using System.Linq;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;
using System.Collections.Generic;
using Uragsha.Signalling.Hubs;
using Microsoft.Extensions.Configuration;
using System.Collections.Concurrent;

namespace Uragsha.Signalling.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IHubContext<MainHub> _hubContext;

        public List<string> connections = new List<string>();
        public ConcurrentDictionary<string, SessionDetail> rooms = new ();
        public string TestEnvValue = "";
        public string ConnectionString = "";

        public IndexModel(ILogger<IndexModel> logger, IHubContext<MainHub> hubContext, IConfiguration configuration)
        {
            _logger = logger;
            _hubContext = hubContext;
            TestEnvValue = configuration.GetSection("TestEnvValue")?.Value;
            ConnectionString = configuration.GetSection("ConnectionStrings:DefaultConnection")?.Value;
        }

        public void OnGet()
        {
            connections = GlobalInfo.ConnectedIds.ToList();
            rooms = GlobalInfo.ActiveSessions;
            TestEnvValue = "bla";

        }
    }
}
