using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;
using Scheduler.Interfaces.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Uragsha.Scheduler.HostedService
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly ISchedulerService schedulerService;

        public Worker(ILogger<Worker> logger, ISchedulerService schedulerService)
        {
            _logger = logger;
            this.schedulerService = schedulerService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                try
                {
                    schedulerService.Schedule(new ScheduleAlgorithm { Method = ScheduleAlgorithmType.FCFS });
                }
                catch (Exception ex)
                {
                    _logger.LogInformation("Something when wrong! {exception}", ex.Message);
                }

                await Task.Delay(5000, stoppingToken);
            }
        }
    }
}
