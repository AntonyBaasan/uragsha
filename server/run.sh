trap 'kill %1; kill %2' SIGINT
dotnet run --project ./Uragsha.Signalling \
& dotnet run --project ./Uragsha.WebApi \
& dotnet run --project ./Uragsha.Scheduler.HostedService \