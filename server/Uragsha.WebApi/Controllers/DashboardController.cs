using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dashboard.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;

namespace Uragsha.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ILogger<SessionRequestController> _logger;
        private readonly DashboardService dashboarService;
        private readonly IDistributedCache cache;

        public DashboardController(
            ILogger<SessionRequestController> logger,
            DashboardService dashboarService,
            IDistributedCache cache
            )
        {
            _logger = logger;
            this.dashboarService = dashboarService;
            this.cache = cache;
        }

        [Authorize]
        [HttpGet("comingsoon")]
        public async Task<IEnumerable<SessionRequest>> ComingSoon()
        {
            var sessionRequests = await dashboarService.GetComingSessionRequests();
            return sessionRequests.OrderBy(s=>s.Start);
        }

        //[HttpGet]
        //public async Task<string> Get()
        //{
        //    var encodedCachedTimeUTC = await cache.GetAsync("cachedTimeUTC");
        //    if (encodedCachedTimeUTC != null)
        //    {
        //        return Encoding.UTF8.GetString(encodedCachedTimeUTC);
        //    }

        //    encodedCachedTimeUTC = GetCurrentTimeUTC();
        //    UpdateCache(encodedCachedTimeUTC);
        //    return Encoding.UTF8.GetString(encodedCachedTimeUTC);
        //}

        //private byte[] GetCurrentTimeUTC()
        //{
        //    var currentTimeUTC = DateTime.UtcNow.ToString();
        //    byte[] encodedCurrentTimeUTC = Encoding.UTF8.GetBytes(currentTimeUTC);
        //    return encodedCurrentTimeUTC;
        //}

        //private async void UpdateCache(byte[] encodedCurrentTimeUTC)
        //{
        //    var options = new DistributedCacheEntryOptions()
        //        //.SetSlidingExpiration(TimeSpan.FromSeconds(10));
        //        .SetAbsoluteExpiration(TimeSpan.FromSeconds(10));
        //    await cache.SetAsync("cachedTimeUTC", encodedCurrentTimeUTC, options);
        //}

    }
}
