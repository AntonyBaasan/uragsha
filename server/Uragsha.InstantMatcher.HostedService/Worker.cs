using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;
using Scheduler.Interfaces.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Uragsha.InstantMatcher.HostedService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IMatcherService _matcherInstantdService;
        private int _interval = 5000;
        public Worker(ILogger<Worker> logger,
            IMatcherService matcherService,
            IConfiguration configuration)
        {
            _logger = logger;
            _matcherInstantdService = matcherService;
            _interval = int.Parse(configuration.GetSection("InstantMatcher:Interval").Value);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation($"Worker will match every {_interval/1000} seconds");
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _matcherInstantdService.Match(new MatchAlgorithm { Algorithm = MatchAlgorithmType.FCFS });

                    _matcherInstantdService.CollectGarbage();
                }
                catch (Exception ex)
                {
                    _logger.LogInformation("Something when wrong! {exception}", ex.Message);
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}
