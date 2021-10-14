using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;
using Scheduler.Interfaces.Services;

namespace Uragsha.Scheduler.HostedService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IMatcherService _matcherScheduledService;
        private int _interval = 5000;
        public Worker(ILogger<Worker> logger,
            IMatcherService matcherService,
            IConfiguration configuration)
        {
            _logger = logger;
            _matcherScheduledService = matcherService;
            _interval = int.Parse(configuration.GetSection("Scheduler:Interval").Value);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation($"Worker will match every {_interval / 1000} seconds");
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _matcherScheduledService.Match(new MatchAlgorithm { Algorithm = MatchAlgorithmType.FCFS });
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
